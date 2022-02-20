from pydantic import BaseSettings


class Settings(BaseSettings):
    db_host: str = "127.0.0.1"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres-dev-password"
    db_name: str = "postgres"
    db_pool_min: int = 2
    db_pool_max: int = 15

    jwt_key: str

    @property
    def db_connection_string(self) -> str:
        return (
            f"postgres://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )
