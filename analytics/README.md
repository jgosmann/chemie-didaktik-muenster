# Analytics backend

## Start backend

```bash
JWT_KEY='signing key' poetry run uvicorn cdm_analytics.main:app --reload --port 8001
```

## Running the tests

```bash
docker-compose up -d
poetry run pytest
```

## Generating OpenAPI spec

```bash
poetry run python3 -m cdm_analytics.write_spec <output file>
```
