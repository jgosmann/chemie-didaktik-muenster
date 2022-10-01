from typing import FrozenSet, List

from pydantic import BaseSettings


class Settings(BaseSettings):
    secure_key: str
    builder_access_token: str
    deta_project_key: str

    use_in_memory_db: bool = False
    enable_docs: bool = False

    additional_cors_origins: FrozenSet[str] = frozenset(
        {
            "http://localhost:8000",
            "http://localhost:9000",
        }
    )

    @property
    def current_jwt_key(self) -> str:
        return self.jwt_keys[0]

    @property
    def jwt_keys(self) -> List[str]:
        return self.secure_key.split(",")

    class Config:
        frozen = True
