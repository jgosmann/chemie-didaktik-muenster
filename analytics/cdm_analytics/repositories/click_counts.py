from collections import defaultdict
from dataclasses import dataclass
from typing import AsyncGenerator, Dict, Tuple


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
