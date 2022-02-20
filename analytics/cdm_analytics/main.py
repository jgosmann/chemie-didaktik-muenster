from typing import List, Optional
from urllib.parse import urlparse

import psycopg
import yoyo
from cdm_analytics.domains import all_parent_domains
from fastapi import Depends, FastAPI, Header, HTTPException, responses, status
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
app = FastAPI()


class DbConnectionPool:
    _pool: Optional[AsyncConnectionPool]

    def __init__(self):
        self._pool = None

    def start_pool(self):
        self._pool = AsyncConnectionPool(
            settings.db_connection_string,
            min_size=settings.db_pool_min,
            max_size=settings.db_pool_max,
        )

    def connection(self) -> psycopg.AsyncConnection:
        if not self._pool:
            raise RuntimeError("connection pool not started")
        return self._pool.connection()


db_conn_pool = DbConnectionPool()
app.on_event("startup")(db_conn_pool.start_pool)


async def db_connection() -> psycopg.AsyncConnection:
    async with db_conn_pool.connection() as conn:
        yield conn


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


@app.get("/tracked/domains", response_model=TrackedDomainsBody)
async def get_tracked_domains(
    conn: psycopg.AsyncConnection = Depends(db_connection),
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
    body: TrackedDomainsBody, conn: psycopg.AsyncConnection = Depends(db_connection)
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
    body: TrackedPathsBody, conn: psycopg.AsyncConnection = Depends(db_connection)
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
) -> ClickStatistics:
    async with conn.cursor(row_factory=psycopg.rows.class_row(ClickCount)) as cursor:
        await cursor.execute(
            "SELECT domain_name, absolute_path as path, click_count as count FROM clicks"
        )
        return ClickStatistics(clicks=await cursor.fetchall())
