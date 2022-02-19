import subprocess
import time
import urllib.parse

import psycopg
import pytest
import requests


class App:
    def __init__(self):
        super().__init__()
        self.host = "127.0.0.1"
        self.port = "8001"
        self._proc = None

    def start(self):
        if self._proc is None:
            # pylint: disable=consider-using-with
            self._proc = subprocess.Popen(
                [
                    "uvicorn",
                    "cdm_analytics:app",
                    "--host",
                    self.host,
                    "--port",
                    self.port,
                ]
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


@pytest.fixture
def clean_db():
    # pylint: disable=not-context-manager
    with psycopg.connect(
        "host=127.0.0.1 dbname=postgres user=postgres password=postgres-dev-password"
    ) as conn:
        with conn.cursor() as cursor:
            cursor.execute("TRUNCATE tracked_domains")
            cursor.execute("TRUNCATE tracked_paths")


def test_tracked_domains(app, clean_db):
    url = app.url("/tracked/domains")
    assert requests.get(url).json() == {"tracked_domains": []}

    data = {"tracked_domains": ["abc.de", "example.org"]}
    assert requests.put(url, json=data).ok
    assert requests.get(url).json() == data


def test_tracked_paths(app, clean_db):
    url = app.url("/tracked/paths")
    assert requests.get(url).json() == {"tracked_paths": []}

    data = {"tracked_paths": ["/a/b/c", "/xyz"]}
    assert requests.put(url, json=data).ok
    assert requests.get(url).json() == data
