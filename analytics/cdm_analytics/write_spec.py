import argparse
import json
from typing import Optional, Sequence

from cdm_analytics.main import app
from fastapi.openapi.utils import get_openapi


def write_spec(args: Optional[Sequence[str]] = None):
    parser = argparse.ArgumentParser(description="Write OpenAPI spec JSON.")
    parser.add_argument("output_file", type=argparse.FileType("w"), help="output file")

    output_file = parser.parse_args(args).output_file
    json.dump(
        get_openapi(
            title=app.title,
            version=app.version,
            openapi_version=app.openapi_version,
            description=app.description,
            routes=app.routes,
        ),
        output_file,
    )


if __name__ == "__main__":
    write_spec()
