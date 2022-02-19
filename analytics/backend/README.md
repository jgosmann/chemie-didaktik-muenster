# Analytics backend

## Running the tests

```bash
docker-compose up -d
poetry run pytest
```

## Generating OpenAPI spec

```bash
poetry run python3 -m cdm_analytics.write_spec <output file>
```
