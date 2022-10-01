from typing import AsyncGenerator, Generic, Iterable, Set, TypeVar

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
    pass


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
