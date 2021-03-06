import logging
import os
from typing import AsyncGenerator, List, Literal
from urllib.parse import urlparse

import jwt
import psycopg
import yoyo
from fastapi import (
    Body,
    Depends,
    FastAPI,
    HTTPException,
    Request,
    Response,
    responses,
    status,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from oauthlib.oauth2 import Server
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

_uncached = object()


def cache(fn):
    value = _uncached

    def with_caching():
        nonlocal value
        if value is _uncached:
            value = fn()
        return value

    return with_caching


@cache
def settings() -> Settings:
    return Settings()


@cache
def oauth2_server() -> Server:
    return create_oauth2_server(settings())


enable_docs = os.environ.get("ENABLE_DOCS", "").lower() in (
    "yes",
    "y",
    "true",
    "enable",
    "1",
)
app = FastAPI(
    docs_url="/docs" if enable_docs else None,
    redoc_url="/redoc" if enable_docs else None,
)
app.on_event("startup")(lambda: db_conn_pool.start_pool(settings()))


class DynamicCORSMiddleware(CORSMiddleware):
    tracked_domains: List[str] = []

    def is_allowed_origin(self, origin: str) -> bool:
        return (
            origin in self.tracked_domains
            or origin in settings().additional_cors_origins
        )


app.add_middleware(
    DynamicCORSMiddleware,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


async def db_connection() -> AsyncGenerator[psycopg.AsyncConnection, None]:
    async with db_conn_pool.connection() as conn:
        yield conn


@app.on_event("startup")
def perform_db_migrations():
    database = yoyo.get_backend(settings().database_url)
    migrations = yoyo.read_migrations("cdm_analytics/db_migrations")
    with database.lock():
        database.apply_migrations(database.to_apply(migrations))

    # pylint: disable=not-context-manager
    with psycopg.connect(settings().database_url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT COUNT(*) FROM users")
            result = cur.fetchone()
            if result[0] == 0:
                cur.execute(*generate_create_initial_user_sql())


@app.on_event("startup")
def load_cors_domains():
    # pylint: disable=not-context-manager
    with psycopg.connect(settings().database_url) as conn:
        with conn.cursor(
            row_factory=psycopg.rows.args_row(lambda domain_name: domain_name)
        ) as cur:
            cur.execute("SELECT domain_name FROM tracked_domains")
            DynamicCORSMiddleware.tracked_domains = cur.fetchall()


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)


async def authenticated(token: str = Depends(oauth2_scheme)) -> dict:
    for key in settings().jwt_keys:
        try:
            claims = jwt.decode(
                token,
                key,
                algorithms=["HS256"],
                issuer=RESOURCE_OWNER_ID,
                audience=RESOURCE_OWNER_ID,
            )
            break
        except jwt.exceptions.InvalidTokenError:
            pass
    else:
        raise credentials_exception

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


@app.head(
    "/health", status_code=status.HTTP_204_NO_CONTENT, response_class=responses.Response
)
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
    DynamicCORSMiddleware.tracked_domains = body.tracked_domains


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


def _remove_trailing_slash(path: str) -> str:
    if path.endswith("/"):
        return path[:-1]
    else:
        return path


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
                await copy.write_row((_remove_trailing_slash(path),))
    await conn.commit()


@app.post(
    "/actions/increment",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def post_increment_action(referrer: str = Body(...)):
    try:
        parsed_referrer = urlparse(referrer)
        if not parsed_referrer.hostname:
            raise ValueError("missing hostname")
    except ValueError as err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid `Referer` header",
        ) from err

    canonical_path = _remove_trailing_slash(parsed_referrer.path)
    async with db_conn_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute(
                """
                SELECT lower(domain_name) FROM tracked_domains
                WHERE lower(domain_name) = ANY(%s)
                  AND exists(SELECT 1 FROM tracked_paths WHERE absolute_path = %s)
            """,
                (
                    [parsed_referrer.hostname]
                    + list(all_parent_domains(parsed_referrer.hostname)),
                    canonical_path,
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
                    (tracking_domain_row[0], canonical_path, 1),
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


class TokenResponse(BaseModel):
    access_token: str
    expires_in: int
    scope: str
    token_type: Literal["Bearer"]


@app.post(
    "/auth/token",
    response_model=TokenResponse,
    openapi_extra={
        "requestBody": {
            "content": {
                "application/x-www-form-urlencoded": {
                    "schema": {
                        "required": ["grant_type", "client_id"],
                        "type": "object",
                        "properties": {
                            "grant_type": {
                                "type": "string",
                                "enum": ["client_credentials", "password"],
                            },
                            "client_id": {"type": "string"},
                            "username": {"type": "string"},
                            "password": {"type": "string"},
                        },
                    }
                }
            },
            "required": True,
        }
    },
)
async def post_token(
    request: Request,
) -> Response:
    headers, body, status = oauth2_server().create_token_response(
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
    try:
        async with conn.cursor() as cursor:
            await cursor.execute(
                *generate_create_user_sql(
                    username,
                    password=request.password,
                    realname=request.realname,
                    comment=request.comment,
                )
            )
    except psycopg.errors.UniqueViolation as err:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="usernames must be unique"
        ) from err


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
        remaining_users_count = await cursor.fetchone()
        if remaining_users_count and remaining_users_count[0] == 1:
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
