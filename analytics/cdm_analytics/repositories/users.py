from dataclasses import dataclass
from typing import Any, AsyncGenerator, Dict, Optional


@dataclass(frozen=True)
class PasswordHash:
    salt: bytes
    algo: str
    params: Dict[str, Any]
    hash: bytes


@dataclass(frozen=True)
class User:
    username: str
    realname: str
    comment: str
    password_hash: PasswordHash


class UniqueViolationError(Exception):
    pass


class UsersRepository:
    async def count(self) -> int:
        raise NotImplementedError

    async def get_user(self, username: str) -> Optional[User]:
        raise NotImplementedError

    def get_user_sync(self, username: str) -> Optional[User]:
        raise NotImplementedError

    async def insert(self, user: User):
        raise NotImplementedError

    def insert_sync(self, user: User):
        raise NotImplementedError

    async def save(self, user: User):
        raise NotImplementedError

    async def delete(self, username: str):
        raise NotImplementedError

    async def fetch_all(self) -> AsyncGenerator[User, None]:
        raise NotImplementedError
        yield  # pylint: disable=unreachable


class InMemoryUsersRepository(UsersRepository):
    def __init__(self):
        super().__init__()
        self.users: Dict[str, User] = {}

    async def count(self) -> int:
        return len(self.users)

    async def get_user(self, username: str) -> Optional[User]:
        return self.get_user_sync(username)

    def get_user_sync(self, username: str) -> Optional[User]:
        return self.users.get(username, None)

    async def insert(self, user: User):
        self.insert_sync(user)

    def insert_sync(self, user: User):
        if user.username in self.users:
            raise UniqueViolationError("username must be unique")
        self.users[user.username] = user

    async def save(self, user: User):
        self.users[user.username] = user

    async def delete(self, username: str):
        del self.users[username]

    async def fetch_all(self) -> AsyncGenerator[User, None]:
        for user in self.users.values():
            yield user
