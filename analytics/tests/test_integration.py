import os
import subprocess
import time
import urllib.parse

import psycopg
import pytest
import requests

from cdm_analytics.auth import FRONTEND_CLIENT_ID, generate_create_user_sql


class App:
    def __init__(self):
        super().__init__()
        self.host = "127.0.0.1"
        self.port = "8001"
        self._proc = None

    def start(self):
        if self._proc is None:
            env = dict(**os.environ)
            env["JWT_KEY"] = "test jwt key"
            # pylint: disable=consider-using-with
            self._proc = subprocess.Popen(
                [
                    "uvicorn",
                    "cdm_analytics.main:app",
                    "--host",
                    self.host,
                    "--port",
                    self.port,
                ],
                env=env,
            )

    def stop(self):
        try:
            self._proc.terminate()
            self._proc.wait(5)
            if self._proc.poll() is None:
                self._proc.kill()
                self._proc.wait()
        finally:
            self._proc = None

    def __enter__(self) -> "App":
        self.start()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.stop()

    @property
    def base_url(self) -> str:
        return f"http://{self.host}:{self.port}/"

    def url(self, path: str) -> str:
        return urllib.parse.urljoin(self.base_url, path)

    def is_healthy(self) -> bool:
        try:
            return requests.get(self.url("/health")).ok
        except requests.ConnectionError:
            return False

    def wait_healthy(self):
        waiting_since = time.time()
        poll_seconds = 0.2
        while not self.is_healthy():
            time.sleep(poll_seconds)
            if time.time() - waiting_since > 5:
                raise TimeoutError("not healthy within 5 seconds")


@pytest.fixture
def app():
    with App() as instance:
        instance.wait_healthy()
        yield instance


TEST_USER = "testuser"
TEST_USER_PASSWORD = "testuser"


@pytest.fixture(autouse=True)
def clean_db():
    # pylint: disable=not-context-manager
    with psycopg.connect(
        "host=127.0.0.1 dbname=postgres user=postgres password=postgres-dev-password"
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute("TRUNCATE tracked_domains")
            cursor.execute("TRUNCATE tracked_paths")
            cursor.execute("TRUNCATE clicks")
            cursor.execute("TRUNCATE users")
        conn.commit()
        with conn.cursor() as cursor:
            cursor.execute(
                *generate_create_user_sql(TEST_USER, password=TEST_USER_PASSWORD)
            )
        conn.commit()


@pytest.fixture
def user_session(app):
    token = requests.post(
        app.url("/auth/token"),
        data={
            "client_id": FRONTEND_CLIENT_ID,
            "grant_type": "password",
            "username": TEST_USER,
            "password": TEST_USER_PASSWORD,
        },
    ).json()["access_token"]

    session = requests.Session()
    session.headers["Authorization"] = f"Bearer {token}"
    return session


def test_tracked_domains(app, user_session):
    url = app.url("/tracked/domains")
    assert user_session.get(url).json() == {"tracked_domains": []}

    data = {"tracked_domains": ["abc.de", "example.org"]}
    assert user_session.put(url, json=data).ok
    assert user_session.get(url).json() == data


def test_tracked_paths(app):
    url = app.url("/tracked/paths")
    assert requests.get(url).json() == {"tracked_paths": []}

    data = {"tracked_paths": ["/a/b/c", "/xyz"]}
    assert requests.put(url, json=data).ok
    assert requests.get(url).json() == data


def test_tracks_referrers(app, user_session):
    assert user_session.put(
        app.url("/tracked/domains"),
        json={"tracked_domains": ["source-domain.net", "source-domain.org"]},
    ).ok
    assert requests.put(
        app.url("/tracked/paths"),
        json={"tracked_paths": ["/path-a", "/path-b", "/path-b/child"]},
    ).ok

    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "http://source-domain.net/path-a"},
    ).ok
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "http://www.source-domain.net/path-a"},
    ).ok
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "https://www.source-domain.net/path-a"},
    ).ok
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "https://source-domain.org/path-b"},
    ).ok
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "https://SOURCE-DOMAIN.org/path-b"},
    ).ok
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "https://source-domain.org/path-b/child"},
    ).ok
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "http://untracked-domain.com/path-a"},
    )
    assert requests.post(
        app.url("/actions/increment"),
        headers={"Referer": "http://source-domain.org/untracked-path"},
    )

    assert user_session.get(app.url("/statistics/clicks")).json() == {
        "clicks": [
            {"domain_name": "source-domain.net", "path": "/path-a", "count": 3},
            {
                "domain_name": "source-domain.org",
                "path": "/path-b",
                "count": 2,
            },
            {
                "domain_name": "source-domain.org",
                "path": "/path-b/child",
                "count": 1,
            },
        ]
    }


def test_increment_action_without_referer(app, user_session):
    status_code = user_session.post(app.url("/actions/increment")).status_code
    assert 400 <= status_code < 500


@pytest.mark.parametrize("referer", ["path-only", "//[::1/path"])
def test_increment_action_without_invalid_referer(referer, app, user_session):
    status_code = user_session.post(
        app.url("/actions/increment"), headers={"Referer": referer}
    ).status_code
    assert 400 <= status_code < 500


def test_access_prohibited_without_token(app):
    restricted_endpoints = [
        ("get", "/tracked/domains"),
        ("put", "/tracked/domains"),
        ("get", "/statistics/clicks"),
    ]
    for method, path in restricted_endpoints:
        assert requests.request(method, app.url(path)).status_code == 401
