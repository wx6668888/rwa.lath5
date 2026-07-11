# RWA.LAT API

NestJS API boundary for RWA.LAT. It currently provides versioned routes, request IDs, consistent errors, input validation, security headers, CORS, OpenAPI and the PostgreSQL/migration baseline. Domain modules are added by the numbered tasks in `docs/Task-Board.md`.

## Local use

1. Copy `.env.example` to `.env` and adjust local values if needed.
2. Start PostgreSQL with `docker compose up -d postgres`. The first initialization creates physically separate `rwa_lat_dev` and `rwa_lat_test` databases.
3. Run `npm install`.
4. Run `npm run db:migration:run`.
5. Run `npm run start:dev`.

Database commands:

- `npm run db:migration:show` lists pending and applied migrations.
- `npm run db:migration:run` applies pending migrations to `DATABASE_URL`.
- `npm run db:migration:revert` reverts the latest applied migration.
- Set `NODE_ENV=test` when running migrations against `TEST_DATABASE_URL`; the configuration refuses to reuse `DATABASE_URL` for tests.
- Deployments set `APP_ENV` to `demo`, `staging`, or `production` and provide the matching environment-specific URL. Database names must carry the matching environment suffix.

Schema synchronization is permanently disabled. Every schema change must use a reviewed migration that supports both `up` and `down`.

Endpoints:

- `GET /v1/health`
- `GET /v1/health/ready`
- `GET /v1/docs`
- `GET /v1/docs-json`

All responses include an `x-request-id` header; successful health responses also include `requestId` in the response body. `GET /v1/health/ready` probes PostgreSQL and returns `503` with `DATABASE_UNAVAILABLE` when the dependency is unavailable. Error responses use the common `error`, `requestId`, `path` and `timestamp` envelope.
