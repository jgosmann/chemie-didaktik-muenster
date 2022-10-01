from __future__ import annotations

import urllib.error
from dataclasses import dataclass
from enum import Enum
from functools import cache
from typing import Any, AsyncGenerator, Dict, Optional

import aiohttp
from deta import AsyncBase, Deta


class Cardinality(Enum):
    EMPTY = 0
    ONE = 1
    MORE_THAN_ONE = 2

    @staticmethod
    def from_count(count: int) -> Cardinality:
        if count == 0:
            return Cardinality.EMPTY
        elif count == 1:
            return Cardinality.ONE
        return Cardinality.MORE_THAN_ONE


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
    async def cardinality(self) -> Cardinality:
        raise NotImplementedError

    def cardinality_sync(self) -> Cardinality:
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

    async def cardinality(self) -> Cardinality:
        return self.cardinality_sync()

    def cardinality_sync(self) -> Cardinality:
        return Cardinality.from_count(len(self.users))

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


class DetaUsersRepository(UsersRepository):
    def __init__(self, deta: Deta, db_name: str):
        super().__init__()
        self._async_base_factory = cache(lambda: deta.AsyncBase(db_name))
        self.base = deta.Base(db_name)

    @property
    def async_base(self) -> AsyncBase:
        return self._async_base_factory()

    async def cardinality(self) -> Cardinality:
        count = len((await self.async_base.fetch(limit=2)).items)
        return Cardinality.from_count(count)

    def cardinality_sync(self) -> Cardinality:
        count = len(self.base.fetch(limit=2).items)
        return Cardinality.from_count(count)

    async def get_user(self, username: str) -> Optional[User]:
        data = await self.async_base.get(username)
        return self._dict_to_user(data) if data else None

    def get_user_sync(self, username: str) -> Optional[User]:
        data = self.base.get(username)
        return self._dict_to_user(data) if data else None

    async def insert(self, user: User):
        try:
            await self.async_base.insert(self._user_to_dict(user), key=user.username)
        except aiohttp.ClientResponseError as err:
            # Deta does not give a more specific exception :(
            if err.status == 409:
                raise UniqueViolationError("username must be unique") from err
            raise

    def insert_sync(self, user: User):
        try:
            self.base.insert(self._user_to_dict(user), key=user.username)
        except urllib.error.HTTPError as err:
            if err.code == 409:
                raise UniqueViolationError("username must be unique") from err
            raise

    async def save(self, user: User):
        await self.async_base.put(self._user_to_dict(user), key=user.username)

    async def delete(self, username: str):
        await self.async_base.delete(username)

    async def fetch_all(self) -> AsyncGenerator[User, None]:
        res = await self.async_base.fetch()
        for item in res.items:
            yield self._dict_to_user(item)

        while res.last:
            res = await self.async_base.fetch(last=res.last)
            for item in res.items:
                yield self._dict_to_user(item)

    def _user_to_dict(self, user: User) -> Dict[str, Any]:
        return {
            "username": user.username,
            "realname": user.realname,
            "comment": user.comment,
            "password_hash": {
                "salt": user.password_hash.salt.hex(),
                "algo": user.password_hash.algo,
                "params": user.password_hash.params,
                "hash": user.password_hash.hash.hex(),
            },
        }

    def _dict_to_user(self, data: Dict[str, Any]) -> User:
        return User(
            username=data["username"],
            realname=data["realname"],
            comment=data["comment"],
            password_hash=PasswordHash(
                salt=bytearray.fromhex(data["password_hash"]["salt"]),
                algo=data["password_hash"]["algo"],
                params=data["password_hash"]["params"],
                hash=bytearray.fromhex(data["password_hash"]["hash"]),
            ),
        )
