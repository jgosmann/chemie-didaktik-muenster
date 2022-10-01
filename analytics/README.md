# Analytics backend

## Start backend

```bash
SECURE_KEY='signing key' BUILDER_ACCESS_TOKEN='builder access token' \
  poetry run uvicorn cdm_analytics.main:app --reload --port 8001
```

## Running the tests

```bash
poetry run pytest
```

## Generating OpenAPI spec

```bash
poetry run python3 -m cdm_analytics.write_spec <output file>
```
