from typing import Optional

import psycopg
from psycopg_pool import AsyncConnectionPool

from cdm_analytics.settings import Settings


class DbConnectionPool:
    _pool: Optional[AsyncConnectionPool]

    def __init__(self):
        self._pool = None

    def start_pool(self, settings: Settings):
        self._pool = AsyncConnectionPool(
            settings.database_url,
            min_size=settings.db_pool_min,
            max_size=settings.db_pool_max,
        )

    def connection(self) -> psycopg.AsyncConnection:
        if not self._pool:
            raise RuntimeError("connection pool not started")
        return self._pool.connection()


db_conn_pool = DbConnectionPool()
