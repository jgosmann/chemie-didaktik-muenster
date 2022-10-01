import json
import os
import subprocess
import time
import urllib.parse

import pytest
import requests

from cdm_analytics.auth import (
    BUILDER_CLIENT_ID,
    FRONTEND_CLIENT_ID,
    TRACKED_PATHS_SCOPE,
)

TEST_ADDITIONAL_CORS_ORIGINS = ["domain-a.org", "domain-org"]
TEST_BUILDER_ACCESS_TOKEN = "builder access token"


class TestSession(requests.Session):
    def request(self, *args, **kwargs):
        kwargs.setdefault("timeout", 1)
        return super().request(*args, **kwargs)


test_session = TestSession()


class App:
    def __init__(self):
        super().__init__()
        self.host = "127.0.0.1"
        self.port = "8001"
        self._proc = None

    def start(self):
        if self._proc is None:
            env = dict(**os.environ)
            env["USE_IN_MEMORY_DB"] = "true"
            env["DETA_PROJECT_KEY"] = ""
            env["SECURE_KEY"] = "test jwt key,old key"
            env["BUILDER_ACCESS_TOKEN"] = TEST_BUILDER_ACCESS_TOKEN
            env["ADDITIONAL_CORS_ORIGINS"] = json.dumps(TEST_ADDITIONAL_CORS_ORIGINS)
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
            return test_session.head(self.url("/health")).ok
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


TEST_USER = "admin"
TEST_USER_PASSWORD = "chemie-didaktik-muenster"


def login(app: App, username: str, password: str) -> requests.Session:
    response = test_session.post(
        app.url("/auth/token"),
        data={
            "client_id": FRONTEND_CLIENT_ID,
            "grant_type": "password",
            "username": username,
            "password": password,
        },
        timeout=1,
    )
    response.raise_for_status()
    token = response.json()["access_token"]

    session = TestSession()
    session.headers["Authorization"] = f"Bearer {token}"
    return session


@pytest.fixture
def user_session(app):
    return login(app, TEST_USER, TEST_USER_PASSWORD)


def authorize_builder(app: App) -> requests.Session:
    response = requests.post(
        app.url("/auth/token"),
        data={
            "client_id": BUILDER_CLIENT_ID,
            "grant_type": "client_credentials",
            "scope": TRACKED_PATHS_SCOPE,
        },
        headers={"Authorization": f"Bearer {TEST_BUILDER_ACCESS_TOKEN}"},
        timeout=1,
    )
    response.raise_for_status()
    token = response.json()["access_token"]

    session = TestSession()
    session.headers["Authorization"] = f"Bearer {token}"
    return session


@pytest.fixture
def builder_session(app):
    return authorize_builder(app)


def test_tracked_domains(app, user_session):
    url = app.url("/tracked/domains")
    assert user_session.get(url).json() == {"tracked_domains": []}

    data = {"tracked_domains": ["abc.de", "example.org"]}
    assert user_session.put(url, json=data).ok
    assert user_session.get(url).json() == data


def test_tracked_paths(app, builder_session):
    url = app.url("/tracked/paths")
    assert builder_session.get(url).json() == {"tracked_paths": []}

    assert builder_session.put(url, json={"tracked_paths": ["/a/b/c", "/xyz/"]}).ok
    assert builder_session.get(url).json() == {"tracked_paths": ["/a/b/c", "/xyz"]}


def test_tracks_referrers(app, user_session, builder_session):
    assert user_session.put(
        app.url("/tracked/domains"),
        json={"tracked_domains": ["source-domain.net", "source-domain.org"]},
    ).ok
    assert builder_session.put(
        app.url("/tracked/paths"),
        json={"tracked_paths": ["/path-a", "/path-b", "/path-b/child"]},
    ).ok

    assert test_session.post(
        app.url("/actions/increment"),
        json="http://source-domain.net/path-a",
    ).ok
    assert test_session.post(
        app.url("/actions/increment"),
        json="http://www.source-domain.net/path-a/",
    ).ok
    assert test_session.post(
        app.url("/actions/increment"),
        json="https://www.source-domain.net/path-a",
    ).ok
    assert test_session.post(
        app.url("/actions/increment"),
        json="https://source-domain.org/path-b",
    ).ok
    assert test_session.post(
        app.url("/actions/increment"),
        json="https://SOURCE-DOMAIN.org/path-b",
    ).ok
    assert test_session.post(
        app.url("/actions/increment"),
        json="https://source-domain.org/path-b/child",
    ).ok
    assert test_session.post(
        app.url("/actions/increment"),
        json="http://untracked-domain.com/path-a",
    )
    assert test_session.post(
        app.url("/actions/increment"),
        json="http://source-domain.org/untracked-path",
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
        app.url("/actions/increment"), json=referer
    ).status_code
    assert 400 <= status_code < 500


def test_get_users(app, user_session):
    username = "new-user"
    data = {"password": "secret", "realname": "John Johnson", "comment": "foo"}
    assert user_session.put(app.url(f"/users/{username}"), json=data).ok
    assert user_session.get(app.url("/users")).json() == {
        "users": [
            {"username": TEST_USER, "realname": "", "comment": ""},
            {
                "username": username,
                "realname": data["realname"],
                "comment": data["comment"],
            },
        ]
    }


def test_created_user_can_login_until_deleted(app, user_session):
    username = "new-user"
    password = "secret"
    assert user_session.put(
        app.url(f"/users/{username}"), json={"password": password}
    ).ok
    login(app, username, password)

    assert user_session.delete(app.url(f"/users/{username}")).ok
    with pytest.raises(requests.exceptions.HTTPError) as err:
        login(app, username, password)
    assert err.value.response.status_code == 400
    assert err.value.response.json() == {
        "error": "invalid_grant",
        "error_description": "Invalid credentials given.",
    }


def test_creating_a_duplicate_user_is_disallowed(app, user_session):
    username = "new-user"
    assert user_session.put(
        app.url(f"/users/{username}"), json={"password": "secret"}
    ).ok
    assert (
        user_session.put(
            app.url(f"/users/{username}"), json={"password": "foo"}
        ).status_code
        == 409
    )


def test_deleting_own_user_is_disallowed(app, user_session):
    assert user_session.delete(app.url(f"/users/{TEST_USER}")).status_code == 405


def test_deleting_last_user_is_disallowed(app, user_session):
    username = "new-user"
    password = "secret"
    assert user_session.put(
        app.url(f"/users/{username}"), json={"password": password}
    ).ok

    new_session = login(app, username, password)
    assert user_session.delete(app.url(f"/users/{username}")).ok
    assert new_session.delete(app.url(f"/users/{TEST_USER}")).status_code == 405


def test_password_change(app, user_session):
    new_password = "new secret"
    assert user_session.post(
        app.url("/profile/change-password"),
        json={"old_password": TEST_USER_PASSWORD, "new_password": new_password},
    ).ok

    with pytest.raises(requests.exceptions.HTTPError) as err:
        login(app, TEST_USER, TEST_USER_PASSWORD)
    assert err.value.response.status_code == 400
    assert err.value.response.json() == {
        "error": "invalid_grant",
        "error_description": "Invalid credentials given.",
    }

    login(app, TEST_USER, new_password)


def test_password_change_is_denied_with_wrong_old_password(app, user_session):
    assert (
        user_session.post(
            app.url("/profile/change-password"),
            json={"old_password": "wrong password", "new_password": "new secret"},
        ).status_code
        == 401
    )
    # old password still valid
    login(app, TEST_USER, TEST_USER_PASSWORD)


def test_access_prohibited_without_token(app):
    restricted_endpoints = [
        ("get", "/tracked/domains"),
        ("put", "/tracked/domains"),
        ("get", "/tracked/paths"),
        ("put", "/tracked/paths"),
        ("get", "/statistics/clicks"),
        ("get", "/users"),
        ("put", "/users/new-user"),
        ("delete", f"/users/{TEST_USER}"),
        ("post", "/profile/change-password"),
    ]
    for method, path in restricted_endpoints:
        assert test_session.request(method, app.url(path)).status_code == 401


def assert_cors_headers(
    headers: requests.structures.CaseInsensitiveDict, domain: str, *, is_preflight=False
):
    assert headers.get("Access-Control-Allow-Origin") == domain
    assert headers.get("Vary") == "Origin"
    assert headers.get("Access-Control-Allow-Credentials")
    if is_preflight:
        allow_headers = headers.get("Access-Control-Allow-Headers", "")
        assert (
            "authorization" in [v.strip().lower() for v in allow_headers.split(",")]
            or allow_headers == "*"
        )


user_endpoints = [
    ("get", "/tracked/domains"),
    ("put", "/tracked/domains"),
    ("get", "/statistics/clicks"),
    ("get", "/users"),
    ("put", "/users/new-user"),
    ("delete", f"/users/{TEST_USER}"),
    ("post", "/profile/change-password"),
]


def test_cors_headers_from_env(app, user_session):
    for method, path in user_endpoints:
        options_headers = test_session.options(
            app.url(path),
            headers={
                "Origin": TEST_ADDITIONAL_CORS_ORIGINS[0],
                "Access-Control-Request-Headers": "Authorization",
                "Access-Control-Request-Method": method,
            },
        ).headers
        assert_cors_headers(
            options_headers, TEST_ADDITIONAL_CORS_ORIGINS[0], is_preflight=True
        )

        main_headers = user_session.request(
            method,
            app.url(path),
            headers={"Origin": TEST_ADDITIONAL_CORS_ORIGINS[0]},
        ).headers
        assert_cors_headers(main_headers, TEST_ADDITIONAL_CORS_ORIGINS[0])


def test_cors_headers_from_tracked_domain(app, user_session):
    domain = "abc.de"
    data = {"tracked_domains": [domain, "example.org"]}
    assert user_session.put(app.url("/tracked/domains"), json=data).ok

    for method, path in user_endpoints:
        options_headers = test_session.options(
            app.url(path),
            headers={
                "Origin": domain,
                "Access-Control-Request-Headers": "Authorization",
                "Access-Control-Request-Method": method,
            },
        ).headers
        assert_cors_headers(options_headers, domain, is_preflight=True)

        main_headers = user_session.request(
            method,
            app.url(path),
            headers={"Origin": domain},
        ).headers
        assert_cors_headers(main_headers, domain)
