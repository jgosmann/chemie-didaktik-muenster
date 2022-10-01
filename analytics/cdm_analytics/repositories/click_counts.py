from collections import defaultdict
from dataclasses import dataclass
from functools import cache
from typing import AsyncGenerator, Dict, Tuple

import aiohttp
from deta import AsyncBase, Deta


@dataclass(frozen=True)
class ClickCountKey:
    domain_name: str
    absolute_path: str


class ClickCountsRepository:
    async def increment(self, key: ClickCountKey):
        raise NotImplementedError

    async def fetch_all(self) -> AsyncGenerator[Tuple[ClickCountKey, int], None]:
        raise NotImplementedError
        yield  # pylint: disable=unreachable


class InMemoryClickCountsRepository(ClickCountsRepository):
    def __init__(self):
        super().__init__()
        self.click_counts: Dict[ClickCountKey, int] = defaultdict(lambda: 0)

    async def increment(self, key: ClickCountKey):
        self.click_counts[key] += 1

    async def fetch_all(self) -> AsyncGenerator[Tuple[ClickCountKey, int], None]:
        for item in self.click_counts.items():
            yield item


class DetaClickCountsRepository(ClickCountsRepository):
    def __init__(self, deta: Deta, db_name: str):
        super().__init__()
        self._base_factory = cache(lambda: deta.AsyncBase(db_name))

    @property
    def base(self) -> AsyncBase:
        return self._base_factory()

    async def increment(self, key: ClickCountKey):
        try:
            await self.base.update(
                {"count": self.base.util.increment()}, key=self._key_to_str(key)
            )
        except aiohttp.ClientResponseError as err:
            if err.status == 404:
                await self.base.insert({"count": 1}, key=self._key_to_str(key))
            else:
                raise

    async def fetch_all(self) -> AsyncGenerator[Tuple[ClickCountKey, int], None]:
        res = await self.base.fetch()
        for item in res.items:
            yield (self._str_to_key(item["key"]), item["count"])

        while res.last:
            res = await self.base.fetch(last=res.last)
            for item in res.items:
                yield (self._str_to_key(item["key"]), item["count"])

    def _key_to_str(self, key: ClickCountKey) -> str:
        return f"{key.domain_name} {key.absolute_path}"

    def _str_to_key(self, key: str) -> ClickCountKey:
        return ClickCountKey(*key.split(" ", maxsplit=1))
