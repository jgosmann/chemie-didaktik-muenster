import pytest
from cdm_analytics.domains import all_parent_domains


@pytest.mark.parametrize(
    "domain, expected",
    [
        ("foo", []),
        ("foo.com", ["com"]),
        ("subsub.sub.main.org", ["sub.main.org", "main.org", "org"]),
    ],
)
def test_all_parent_domains(domain, expected):
    assert list(all_parent_domains(domain)) == expected
