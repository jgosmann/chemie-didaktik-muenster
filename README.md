# Chemie Didaktik Münster Website

See `./analytics` for the analytics back end.

## Start in development mode

```bash
npx gatsby develop
```

## Build and start in production mode

```bash
npx gatsby build
npx gatsby serve
```

## Type-checking and linting

```bash
npm run type-check
npm run lint
```

## Storybook to preview components

```bash
npm run storybook
```

## Run unit tests

```bash
npm test
```

## Run E2E tests

```bash
(cd ./analytics && docker-compose up -d)
npm run e2e
```
