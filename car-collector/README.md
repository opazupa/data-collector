# Car collector🏎️🚗🚔

> _**Nettiauto**_ car `data` collector 🚔

Fetches new car ad info from _**Nettiauto**_ and stores them for later analysis.

## Features 📦💥

- Get new cars with AWS lambda from _**Nettiauto**_ API
- Save new cars daily to AWS S3 partitioned storage
- AWS Glue + Athena for data analysis
- Serverless framework + Cloudformation for infra.
- _**Sentry.io**_ on issue lookout!
- VS Code dev container for local dev setup 🐳 🐳

## Pipelines 🚀

[![Car Collector CI/CD](https://github.com/opazupa/data-collector/actions/workflows/car_collector.yml/badge.svg)](https://github.com/opazupa/data-collector/actions/workflows/car_collector.yml)

### Including

- Build
- Lint
- Unit test
- Cloudformation deployment

## How to get started 👋

> [After having the dev env setup](../README.md#Local-dev-environment-)

### Env variables

Create a `.env` file and fill in the `<add-your-own>` values from [.env.dev](./.env.dev)

### Running locally

```bash
# If not already
npm install

# Invoke one function locally
npm run invoke "Function name and params"

# Start a local offline environment with serverless-offline
npm run local
```

### Other commands

| Command         | Description                                   |
| --------------- | --------------------------------------------- |
| `npm run build` | Build the `serverless` stack with `typescript` |
| `npm run test`  | Run unit tests under [tests](./tests)         |
| `npm run lint`  | Run `eslint` to check code style                    |
