import hashlib
import logging
import os
from datetime import datetime, timedelta
from typing import List, NamedTuple

import jwt
from oauthlib.oauth2 import RequestValidator, Server

from cdm_analytics.repositories.users import PasswordHash, UsersRepository
from cdm_analytics.settings import Settings

logger = logging.getLogger(__name__)

BUILDER_CLIENT_ID = "e25bc9ce-73d8-4e8c-8c0c-b0d8fcffe24f"
FRONTEND_CLIENT_ID = "646ad66f-6815-4fdc-ae75-430fc8e4e556"
DEFAULT_SCOPE = "cdm-analytics"
TRACKED_PATHS_SCOPE = "tracked-paths"
RESOURCE_OWNER_ID = "cdm-analytics"


class Client(NamedTuple):
    client_id: str


def jwt_hs256_token_generator(key: str):
    def token_generator(request):
        now = datetime.utcnow()
        claims = {
            "sub": request.subject,
            "scope": request.scope,
            "aud": [RESOURCE_OWNER_ID],
            "iss": RESOURCE_OWNER_ID,
            "exp": now + timedelta(seconds=request.expires_in),
            "nbf": now,
            "iat": now,
        }

        return jwt.encode(claims, key, algorithm="HS256")

    return token_generator


class CdmAnalyticsRequestValidator(RequestValidator):
    # pylint: disable=abstract-method

    def __init__(self, settings: Settings, user_repository: UsersRepository):
        self.settings = settings
        self.user_repository = user_repository

    def authenticate_client(self, request, *args, **kwargs) -> bool:
        is_authenticated = request.client_id == FRONTEND_CLIENT_ID or (
            request.client_id == BUILDER_CLIENT_ID
            and request.headers.get("Authorization")
            == f"Bearer {self.settings.builder_access_token}"
        )
        if is_authenticated:
            request.client = Client(request.client_id)
            if request.client_id == BUILDER_CLIENT_ID:
                request.subject = BUILDER_CLIENT_ID
        return is_authenticated

    def authenticate_client_id(self, client_id, request, *args, **kwargs) -> bool:
        if client_id in (FRONTEND_CLIENT_ID, BUILDER_CLIENT_ID):
            request.client = Client(client_id)
            return True
        else:
            return False

    def client_authentication_required(self, request, *args, **kwargs) -> bool:
        return False

    def get_default_scopes(self, client_id, request, *args, **kwargs) -> List[str]:
        return [DEFAULT_SCOPE]

    def save_bearer_token(self, token, request, *args, **kwargs) -> None:
        pass

    def validate_client_id(self, client_id, request, *args, **kwargs) -> bool:
        return client_id == FRONTEND_CLIENT_ID

    def validate_grant_type(
        self, client_id, grant_type, client, request, *args, **kwargs
    ) -> bool:
        return (client_id == FRONTEND_CLIENT_ID and grant_type == "password") or (
            client_id == BUILDER_CLIENT_ID and grant_type == "client_credentials"
        )

    def validate_scopes(
        self, client_id, scopes, client, request, *args, **kwargs
    ) -> bool:
        if client_id == FRONTEND_CLIENT_ID and scopes == [DEFAULT_SCOPE]:
            request.scope = scopes
            return True
        elif client_id == BUILDER_CLIENT_ID and scopes == [TRACKED_PATHS_SCOPE]:
            request.scope = scopes
            return True
        else:
            return False

    def validate_user(
        self, username, password, client, request, *args, **kwargs
    ) -> bool:
        user = self.user_repository.get_user_sync(username)
        if not user:
            return False

        is_authorized = verify_password(password, user.password_hash)
        if is_authorized:
            request.subject = username
        return is_authorized


def hash_password(password: str) -> PasswordHash:
    salt = os.urandom(32)
    hash_params = {"r": 8, "p": 1, "n": 2**14}
    return PasswordHash(
        salt,
        "scrypt",
        params=hash_params,
        hash=hashlib.scrypt(password.encode("utf-8"), salt=salt, **hash_params),
    )


def verify_password(password: str, password_hash: PasswordHash) -> bool:
    if password_hash.algo == "scrypt":
        return password_hash.hash == hashlib.scrypt(
            password.encode("utf-8"),
            salt=password_hash.salt,
            **password_hash.params,
        )
    else:
        logger.error("unsupported password hash: %s", password_hash.algo)
        return False


def create_oauth2_server(
    settings: Settings, users_repository: UsersRepository
) -> Server:
    validator = CdmAnalyticsRequestValidator(settings, users_repository)
    oauth2_server = Server(
        validator, token_generator=jwt_hs256_token_generator(settings.current_jwt_key)
    )
    oauth2_server.password_grant.refresh_token = False
    return oauth2_server
