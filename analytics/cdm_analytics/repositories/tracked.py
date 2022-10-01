import functools
from typing import AsyncGenerator, Generic, Iterable, Optional, Set, TypeVar

from deta import AsyncBase, Deta

T = TypeVar("T", contravariant=True)


class SetRepository(Generic[T]):
    async def add_all(self, items: Iterable[T]):
        raise NotImplementedError

    async def clear(self):
        raise NotImplementedError

    async def contains(self, item: T) -> bool:
        raise NotImplementedError

    async def fetch_all(self) -> AsyncGenerator[T, None]:
        raise NotImplementedError
        yield  # pylint: disable=unreachable

    async def replace(self, items: Iterable[T]):
        await self.clear()
        await self.add_all(items)


class TrackedDomainsRepository(SetRepository[str]):
    # pylint: disable=abstract-method

    def fetch_all_sync(self) -> Set[str]:
        raise NotImplementedError


class TrackedPathsRepository(SetRepository[str]):
    # pylint: disable=abstract-method
    pass


class InMemoryTrackedDomainsRepository(TrackedDomainsRepository):
    def __init__(self):
        super().__init__()
        self.tracked_domains: Set[str] = set()

    async def add_all(self, items: Iterable[str]):
        self.tracked_domains.update(items)

    async def clear(self):
        self.tracked_domains.clear()

    async def contains(self, item: str) -> bool:
        return item in self.tracked_domains

    async def fetch_all(self) -> AsyncGenerator[str, None]:
        for domain in self.tracked_domains:
            yield domain

    def fetch_all_sync(self) -> Set[str]:
        return set(self.tracked_domains)


class InMemoryTrackedPathsRepository(TrackedPathsRepository):
    def __init__(self):
        super().__init__()
        self.tracked_paths: Set[str] = set()

    async def add_all(self, items: Iterable[str]):
        self.tracked_paths.update(items)

    async def clear(self):
        self.tracked_paths.clear()

    async def contains(self, item: str) -> bool:
        return item in self.tracked_paths

    async def fetch_all(self) -> AsyncGenerator[str, None]:
        for path in self.tracked_paths:
            yield path


class DetaTrackedDomainsRepository(TrackedDomainsRepository):
    def __init__(self, deta: Deta, db_name: str, key: str):
        super().__init__()
        self._base_factory = functools.cache(lambda: deta.AsyncBase(db_name))
        self.sync_base = deta.Base(db_name)
        self.key = key
        self._cache: Optional[Set[str]] = None

    @property
    def base(self) -> AsyncBase:
        return self._base_factory()

    async def _get_initialized_cache(self) -> Set[str]:
        if not self._cache:
            data = await self.base.get(self.key)
            self._cache = set(data.keys()) if data else set()
            if "key" in self._cache:
                self._cache.remove("key")
        return self._cache

    async def add_all(self, items: Iterable[str]):
        cache = await self._get_initialized_cache()
        cache.update(items)
        await self.base.put({k: None for k in cache}, key=self.key)

    async def clear(self):
        self._cache = set()
        await self.base.put({}, key=self.key)

    async def contains(self, item: str) -> bool:
        return item in await self._get_initialized_cache()

    async def fetch_all(self) -> AsyncGenerator[str, None]:
        cache = await self._get_initialized_cache()
        for item in cache:
            yield item

    def fetch_all_sync(self) -> Set[str]:
        data = self.sync_base.get(self.key)
        return set(data.keys()) if data else set()


class DetaTrackedPathsRepository(TrackedPathsRepository):
    def __init__(self, deta: Deta, db_name: str, key: str):
        super().__init__()
        self._base_factory = functools.cache(lambda: deta.AsyncBase(db_name))
        self.key = key
        self._cache: Optional[Set[str]] = None

    @property
    def base(self):
        return self._base_factory()

    async def _get_initialized_cache(self) -> Set[str]:
        if not self._cache:
            data = await self.base.get(self.key)
            self._cache = set(data.keys()) if data else set()
            if "key" in self._cache:
                self._cache.remove("key")
        return self._cache

    async def add_all(self, items: Iterable[str]):
        cache = await self._get_initialized_cache()
        cache.update(items)
        await self.base.put({k: None for k in cache}, key=self.key)

    async def clear(self):
        self._cache = set()
        await self.base.put({}, key=self.key)

    async def contains(self, item: str) -> bool:
        return item in await self._get_initialized_cache()

    async def fetch_all(self) -> AsyncGenerator[str, None]:
        cache = await self._get_initialized_cache()
        for item in cache:
            yield item
