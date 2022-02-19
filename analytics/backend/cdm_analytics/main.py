from typing import List

import psycopg
import yoyo
from fastapi import FastAPI, responses, status
from psycopg_pool import AsyncConnectionPool
from pydantic import BaseModel, BaseSettings


class Settings(BaseSettings):
    db_host: str = "127.0.0.1"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres-dev-password"
    db_name: str = "postgres"
    db_pool_min: int = 2
    db_pool_max: int = 15

    @property
    def db_connection_string(self) -> str:
        return (
            f"postgres://{settings.db_user}:{settings.db_password}"
            f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
        )


settings = Settings()
db_conn_pool = AsyncConnectionPool(
    settings.db_connection_string,
    min_size=settings.db_pool_min,
    max_size=settings.db_pool_max,
)
app = FastAPI()


@app.on_event("startup")
def perform_db_migrations():
    database = yoyo.get_backend(settings.db_connection_string)
    migrations = yoyo.read_migrations("cdm_analytics/db_migrations")
    with database.lock():
        database.apply_migrations(database.to_apply(migrations))


@app.get(
    "/health", status_code=status.HTTP_204_NO_CONTENT, response_class=responses.Response
)
def health():
    pass


class TrackedDomainsBody(BaseModel):
    tracked_domains: List[str]


@app.get("/tracked-domains")
async def get_tracked_domains():
    async with db_conn_pool.connection() as conn:
        async with conn.cursor(
            row_factory=psycopg.rows.args_row(lambda domain_name: domain_name)
        ) as cursor:
            await cursor.execute("SELECT domain_name FROM tracked_domains")
            rows = await cursor.fetchall()
    return TrackedDomainsBody(tracked_domains=rows)


@app.put(
    "/tracked-domains",
    status_code=status.HTTP_204_NO_CONTENT,
    response_class=responses.Response,
)
async def put_tracked_domains(body: TrackedDomainsBody):
    async with db_conn_pool.connection() as conn:
        async with conn.cursor() as cursor:
            await cursor.execute("TRUNCATE tracked_domains")
            async with cursor.copy(
                "COPY tracked_domains (domain_name) FROM STDIN"
            ) as copy:
                for domain in body.tracked_domains:
                    await copy.write_row((domain,))
        await conn.commit()
