import logging
from typing import List
from urllib.parse import urlparse

import jwt
import psycopg
import yoyo
from fastapi import (
    Body,
    Depends,
    FastAPI,
    Header,
    HTTPException,
    Request,
    Response,
    responses,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from psycopg.types.json import Jsonb
from pydantic import BaseModel

from cdm_analytics.auth import (
    DEFAULT_SCOPE,
    RESOURCE_OWNER_ID,
    TRACKED_PATHS_SCOPE,
    create_oauth2_server,
    generate_create_initial_user_sql,
    generate_create_user_sql,
    hash_password,
    verify_password,
)
from cdm_analytics.db import db_conn_pool
from cdm_analytics.domains import all_parent_domains
from cdm_analytics.settings import Settings

logger = logging.getLogger(__name__)

settings = Settings()
oauth2_server = create_oauth2_server(settings)
app = FastAPI()
app.on_event("startup")(lambda: db_conn_pool.start_pool(settings))

origins = ["http://localhost:8000", "http://localhost:9000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def db_connection() -> psycopg.AsyncConnection:
    async with db_conn_pool.connection() as conn:
        yield conn


@app.on_event("startup")
def perform_db_migrations():
    database = yoyo.get_backend(settings.db_connection_string)
    migrations = yoyo.read_migrations("cdm_analytics/db_migrations")
    with database.lock():
        database.apply_migrations(database.to_apply(migrations))

    # pylint: disable=not-context-manager
    with psycopg.connect(settings.db_connection_string) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM users")
            result = cur.fetchone()
            if result[0] == 0:
                cur.execute(*generate_create_initial_user_sql())


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def authenticated(token: str = Depends(oauth2_scheme)) -> dict:

    try:
        claims = jwt.decode(
            token,
            settings.jwt_key,
            algorithms=["HS256"],
            issuer=RESOURCE_OWNER_ID,
            audience=RESOURCE_OWNER_ID,
        )
    except jwt.exceptions.InvalidTokenError as err:
        logger.info("unauthorized: %s", err)
        raise credentials_exception from err
    if RESOURCE_OWNER_ID not in claims["aud"]:
        raise credentials_exception

    return claims


async def authenticated_user(claims: dict = Depends(authenticated)) -> dict:
    if DEFAULT_SCOPE not in claims["scope"]:
        raise credentials_exception
    return claims


async def authenticated_builder(claims: dict = Depends(authenticated)) -> dict:
    if TRACKED_PATHS_SCOPE not in claims["scope"]:
        raise credentials_exception
    return claims


@app.get(
    "/health", status_code=status.HTTP_204_NO_CONTENT, response_class=responses.Response
)
def health():
    pass


class TrackedDomainsBody(BaseModel):
    tracked_domains: List[str]


@app.get("/tracked/domains", response_model=TrackedDomainsBody)
async def get_tracked_domains(
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
) -> TrackedDomainsBody:
    async with conn.cursor(
        row_factory=psycopg.rows.args_row(lambda domain_name: domain_name)
    ) as cursor:
        await cursor.execute("SELECT domain_name FROM tracked_domains")
        rows = await cursor.fetchall()
    return TrackedDomainsBody(tracked_domains=rows)


@app.put(
    "/tracked/domains",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def put_tracked_domains(
    body: TrackedDomainsBody,
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
):
    async with conn.cursor() as cursor:
        await cursor.execute("TRUNCATE tracked_domains")
        async with cursor.copy("COPY tracked_domains (domain_name) FROM STDIN") as copy:
            for domain in body.tracked_domains:
                await copy.write_row((domain,))
    await conn.commit()


class TrackedPathsBody(BaseModel):
    tracked_paths: List[str]


@app.get("/tracked/paths", response_model=TrackedPathsBody)
async def get_tracked_paths(
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_builder: dict = Depends(authenticated_builder),
) -> TrackedPathsBody:
    async with conn.cursor(
        row_factory=psycopg.rows.args_row(lambda domain_name: domain_name)
    ) as cursor:
        await cursor.execute("SELECT absolute_path FROM tracked_paths")
        rows = await cursor.fetchall()
    return TrackedPathsBody(tracked_paths=rows)


@app.put(
    "/tracked/paths",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def put_tracked_paths(
    body: TrackedPathsBody,
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_builder: dict = Depends(authenticated_builder),
):
    async with conn.cursor() as cursor:
        await cursor.execute("TRUNCATE tracked_paths")
        async with cursor.copy("COPY tracked_paths (absolute_path) FROM STDIN") as copy:
            for path in body.tracked_paths:
                await copy.write_row((path,))
    await conn.commit()


@app.post(
    "/actions/increment",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def post_increment_action(referer_header: str = Header(None, alias="Referer")):
    if not referer_header:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="missing `Referer` header"
        )

    try:
        referrer = urlparse(referer_header)
        if not referrer.hostname:
            raise ValueError("missing hostname")
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid `Referer` header",
        ) from err

    async with db_conn_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                """
                SELECT lower(domain_name) FROM tracked_domains
                WHERE lower(domain_name) = ANY(%s)
                  AND exists(SELECT 1 FROM tracked_paths WHERE absolute_path = %s)
            """,
                (
                    [referrer.hostname] + list(all_parent_domains(referrer.hostname)),
                    referrer.path,
                ),
            )
            tracking_domain_row = await cursor.fetchone()
            if tracking_domain_row:
                await cursor.execute(
                    """
                    INSERT INTO clicks (domain_name, absolute_path, click_count)
                    VALUES (%s, %s, %s)
                    ON CONFLICT (domain_name, absolute_path)
                    DO UPDATE SET click_count = clicks.click_count + 1
                """,
                    (tracking_domain_row[0], referrer.path, 1),
                )
        await conn.commit()


class ClickCount(BaseModel):
    domain_name: str
    path: str
    count: int


class ClickStatistics(BaseModel):
    clicks: List[ClickCount]


@app.get("/statistics/clicks", response_model=ClickStatistics)
async def get_statistics_clicks(
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
) -> ClickStatistics:
    async with conn.cursor(row_factory=psycopg.rows.class_row(ClickCount)) as cursor:
        await cursor.execute(
            "SELECT domain_name, absolute_path as path, click_count as count FROM clicks"
        )
        return ClickStatistics(clicks=await cursor.fetchall())


@app.post("/auth/token")
async def post_token(request: Request) -> Response:
    headers, body, status = oauth2_server.create_token_response(
        str(request.url), request.method, await request.body(), request.headers
    )
    return Response(status_code=status, headers=headers, content=body)


class UserData(BaseModel):
    username: str
    realname: str
    comment: str


class UsersResponseBody(BaseModel):
    users: List[UserData]


@app.get("/users", response_model=UsersResponseBody)
async def get_users(
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
) -> UsersResponseBody:
    async with conn.cursor(row_factory=psycopg.rows.class_row(UserData)) as cursor:
        await cursor.execute("SELECT username, realname, comment FROM users")
        return UsersResponseBody(users=await cursor.fetchall())


class CreateUserRequest(BaseModel):
    password: str
    realname: str = ""
    comment: str = ""


@app.put(
    "/users/{username}",
    status_code=status.HTTP_201_CREATED,
    response_class=responses.Response,
)
async def put_user(
    username: str,
    request: CreateUserRequest,
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
):
    async with conn.cursor() as cursor:
        await cursor.execute(
            *generate_create_user_sql(
                username,
                password=request.password,
                realname=request.realname,
                comment=request.comment,
            )
        )


@app.delete(
    "/users/{username}",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def delete_user(
    username: str,
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
):
    if authenticated_user["sub"] == username:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="you must not delete yourself",
        )
    async with conn.cursor() as cursor:
        await cursor.execute("SELECT count(*) FROM USERS")
        if (await cursor.fetchone())[0] == 1:
            raise HTTPException(
                status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
                detail="you cannot delete the last remaining user",
            )
        await cursor.execute("DELETE FROM users WHERE username = %s", (username,))


@app.post(
    "/profile/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def change_password(
    old_password: str = Body(...),
    new_password: str = Body(...),
    conn: psycopg.AsyncConnection = Depends(db_connection),
    authenticated_user: dict = Depends(authenticated_user),
):
    async with conn.cursor() as cursor:
        await cursor.execute(
            "SELECT password_hash FROM users WHERE username = %s",
            (authenticated_user["sub"],),
        )
        result = await cursor.fetchone()
        if not result:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="you have been deleted"
            )
        old_password_hash = result[0]

        if not verify_password(old_password, old_password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="wrong password"
            )

        await cursor.execute(
            "UPDATE users SET password_hash = %s", (Jsonb(hash_password(new_password)),)
        )
