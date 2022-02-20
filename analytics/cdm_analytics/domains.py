from typing import Generator


def all_parent_domains(domain: str) -> Generator[str, None, None]:
    parts = domain.split(".")
    for i in range(1, len(parts)):
        yield ".".join(parts[i:])
