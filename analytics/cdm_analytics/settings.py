from typing import List

from pydantic import BaseSettings


class Settings(BaseSettings):
    database_url = "postgres://postgres:postgres-dev-password@127.0.0.1:5432/postgres"
    db_pool_min: int = 2
    db_pool_max: int = 15

    secure_key: str
    builder_access_token: str

    enable_docs: bool = False

    additional_cors_origins: List[str] = [
        "http://localhost:8000",
        "http://localhost:9000",
    ]

    @property
    def current_jwt_key(self) -> str:
        return self.jwt_keys[0]

    @property
    def jwt_keys(self) -> List[str]:
        return self.secure_key.split(",")
