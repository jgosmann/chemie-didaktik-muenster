import logging
import os
from dataclasses import replace
from functools import cache
from typing import List, Literal, Optional
from urllib.parse import urlparse

import jwt
from deta import Deta
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
from pydantic import BaseModel

from cdm_analytics.auth import (
    DEFAULT_SCOPE,
    RESOURCE_OWNER_ID,
    TRACKED_PATHS_SCOPE,
    create_oauth2_server,
    hash_password,
    verify_password,
)
from cdm_analytics.domains import all_parent_domains
from cdm_analytics.repositories.click_counts import (
    ClickCountKey,
    ClickCountsRepository,
    DetaClickCountsRepository,
    InMemoryClickCountsRepository,
)
from cdm_analytics.repositories.tracked import (
    DetaTrackedDomainsRepository,
    DetaTrackedPathsRepository,
    InMemoryTrackedDomainsRepository,
    InMemoryTrackedPathsRepository,
    TrackedDomainsRepository,
    TrackedPathsRepository,
)
from cdm_analytics.repositories.users import (
    Cardinality,
    DetaUsersRepository,
    InMemoryUsersRepository,
    UniqueViolationError,
    User,
    UsersRepository,
)
from cdm_analytics.settings import Settings

logger = logging.getLogger(__name__)


@cache
def settings() -> Settings:
    return Settings()


@cache
def get_deta() -> Optional[Deta]:
    loaded_settings = settings()
    if loaded_settings.use_in_memory_db:
        return None
    return Deta(loaded_settings.deta_project_key)


@cache
def get_tracked_domains_repository(
    deta: Optional[Deta] = Depends(get_deta),
) -> TrackedDomainsRepository:
    if deta:
        return DetaTrackedDomainsRepository(deta, "sets", "tracked_domains")
    return InMemoryTrackedDomainsRepository()


@cache
def get_tracked_paths_repository(
    deta: Optional[Deta] = Depends(get_deta),
) -> TrackedPathsRepository:
    if deta:
        return DetaTrackedPathsRepository(deta, "sets", "tracked_paths")
    return InMemoryTrackedPathsRepository()


@cache
def get_click_counts_repository(
    deta: Optional[Deta] = Depends(get_deta),
) -> ClickCountsRepository:
    if deta:
        return DetaClickCountsRepository(deta, "click_counts")
    return InMemoryClickCountsRepository()


@cache
def get_users_repository() -> UsersRepository:
    deta = get_deta()
    if deta:
        return DetaUsersRepository(deta, "users")
    return InMemoryUsersRepository()


@cache
def get_oauth2_server(
    users_repository: UsersRepository = Depends(get_users_repository),
) -> Server:
    return create_oauth2_server(settings(), users_repository)


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


@app.on_event("startup")
def ensure_initial_user_exists():
    users_repository = get_users_repository()
    if users_repository.cardinality_sync() == Cardinality.EMPTY:
        logger.warning(
            "No existing users, creating default user. "
            "Please change the credentials!"
        )
        users_repository.insert_sync(
            User(
                username="admin",
                realname="",
                comment="",
                password_hash=hash_password("chemie-didaktik-muenster"),
            )
        )


@app.on_event("startup")
def load_cors_domains():
    tracked_domains_repository = get_tracked_domains_repository(get_deta())
    DynamicCORSMiddleware.tracked_domains = list(
        tracked_domains_repository.fetch_all_sync()
    )


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
    tracked_domains_repository: TrackedDomainsRepository = Depends(
        get_tracked_domains_repository
    ),
    authenticated_user: dict = Depends(authenticated_user),
) -> TrackedDomainsBody:
    return TrackedDomainsBody(
        tracked_domains=sorted(
            [domain async for domain in tracked_domains_repository.fetch_all()]
        )
    )


@app.put(
    "/tracked/domains",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def put_tracked_domains(
    body: TrackedDomainsBody,
    tracked_domains_repository: TrackedDomainsRepository = Depends(
        get_tracked_domains_repository
    ),
    authenticated_user: dict = Depends(authenticated_user),
):
    await tracked_domains_repository.replace(body.tracked_domains)
    DynamicCORSMiddleware.tracked_domains = body.tracked_domains


class TrackedPathsBody(BaseModel):
    tracked_paths: List[str]


@app.get("/tracked/paths", response_model=TrackedPathsBody)
async def get_tracked_paths(
    tracked_paths_repository: TrackedPathsRepository = Depends(
        get_tracked_paths_repository
    ),
    authenticated_builder: dict = Depends(authenticated_builder),
) -> TrackedPathsBody:
    return TrackedPathsBody(
        tracked_paths=sorted(
            [path async for path in tracked_paths_repository.fetch_all()]
        )
    )


def _remove_trailing_slash(path: str) -> str:
    if path == "":
        return "/"
    elif path == "/":
        return path
    elif path.endswith("/"):
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
    tracked_paths_repository: TrackedPathsRepository = Depends(
        get_tracked_paths_repository
    ),
    authenticated_builder: dict = Depends(authenticated_builder),
):
    await tracked_paths_repository.replace(
        _remove_trailing_slash(path) for path in body.tracked_paths
    )


@app.post(
    "/actions/increment",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def post_increment_action(
    referrer: str = Body(...),
    tracked_domains_repository: TrackedDomainsRepository = Depends(
        get_tracked_domains_repository
    ),
    tracked_paths_repository: TrackedPathsRepository = Depends(
        get_tracked_paths_repository
    ),
    click_counts_repository: ClickCountsRepository = Depends(
        get_click_counts_repository
    ),
):
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
    if not await tracked_paths_repository.contains(canonical_path):
        return
    for domain in [parsed_referrer.hostname] + list(
        all_parent_domains(parsed_referrer.hostname)
    ):
        canonical_domain = domain.lower()
        if await tracked_domains_repository.contains(canonical_domain):
            await click_counts_repository.increment(
                ClickCountKey(canonical_domain, canonical_path)
            )


class ClickCount(BaseModel):
    domain_name: str
    path: str
    count: int


class ClickStatistics(BaseModel):
    clicks: List[ClickCount]


@app.get("/statistics/clicks", response_model=ClickStatistics)
async def get_statistics_clicks(
    click_counts_repository: ClickCountsRepository = Depends(
        get_click_counts_repository
    ),
    authenticated_user: dict = Depends(authenticated_user),
) -> ClickStatistics:
    return ClickStatistics(
        clicks=[
            ClickCount(domain_name=key.domain_name, path=key.absolute_path, count=count)
            async for key, count in click_counts_repository.fetch_all()
        ]
    )


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
    oauth2_server: Server = Depends(get_oauth2_server),
) -> Response:
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
    users_repository: UsersRepository = Depends(get_users_repository),
    authenticated_user: dict = Depends(authenticated_user),
) -> UsersResponseBody:
    return UsersResponseBody(
        users=[
            UserData(
                username=user.username, realname=user.realname, comment=user.comment
            )
            async for user in users_repository.fetch_all()
        ]
    )


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
    users_repository: UsersRepository = Depends(get_users_repository),
    authenticated_user: dict = Depends(authenticated_user),
):
    try:
        await users_repository.insert(
            User(
                username,
                request.realname,
                request.comment,
                hash_password(request.password),
            )
        )
    except UniqueViolationError as err:
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
    users_repository: UsersRepository = Depends(get_users_repository),
    authenticated_user: dict = Depends(authenticated_user),
):
    if authenticated_user["sub"] == username:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="you must not delete yourself",
        )
    if await users_repository.cardinality() == Cardinality.ONE:
        raise HTTPException(
            status_code=status.HTTP_405_METHOD_NOT_ALLOWED,
            detail="you cannot delete the last remaining user",
        )
    await users_repository.delete(username)


@app.post(
    "/profile/change-password",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def change_password(
    old_password: str = Body(...),
    new_password: str = Body(...),
    users_repository: UsersRepository = Depends(get_users_repository),
    authenticated_user: dict = Depends(authenticated_user),
):
    user = await users_repository.get_user(authenticated_user["sub"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="you have been deleted"
        )
    if not verify_password(old_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="wrong password"
        )
    await users_repository.save(
        replace(user, password_hash=hash_password(new_password))
    )
