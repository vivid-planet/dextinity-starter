# Preview Environment

Runs the complete application in docker: `api`, `admin` and `site` plus postgres, imgproxy,
the auth proxy and a local identity provider. Nothing has to be installed on the host except
docker - no node, no `./install.sh`, no build. Everything is built inside the images.

The goal is to bring up a preview environment (e.g. one per pull request) with as little effort
as possible. It is **not** a development environment: the applications are built like in
production, there is no hot reloading. For development use `npm run dev` (see the main README).

For the "real" deployment to a server with traefik and letsencrypt see `.docker-compose/`.

## Requirements

Docker (with compose) and network access during the build: npm registry,
`registry.access.redhat.com` (base images), `mirror.gcr.io`, `quay.io` and github.com
(the translations are cloned by `intl-update.sh`).

## Usage

```bash
.docker-preview/preview.sh          # start (or update) an instance for the current branch
.docker-preview/preview.sh down     # stop it and delete its data
```

The script picks a name (from the git branch) and free ports, and prints the urls at the end.
The first run takes a few minutes because api, admin and site are built from source.

Without the script:

```bash
PREVIEW_NAME=pr-123 PREVIEW_SITE_PORT=3100 PREVIEW_ADMIN_PORT=3101 PREVIEW_IDP_PORT=3102 \
    docker compose -f docker-compose.preview.yml up --build -d
```

Log in to the admin with any of the static users of `api/src/auth/static-users.ts`
(no password, the identity provider is a development one).

## Several instances at the same time

Every instance needs its own `PREVIEW_NAME` and its own ports. `PREVIEW_NAME` is used as the
docker compose project name, so containers, networks and volumes are separate per instance.
Only three ports are published (site, admin, identity provider), everything else is only
reachable inside the compose network.

## Configuration

| Variable                      | Default             | Description                                                  |
| ----------------------------- | ------------------- | ------------------------------------------------------------ |
| `PREVIEW_NAME`                | `dextinity-preview` | Compose project name, one per instance                       |
| `PREVIEW_HOST`                | `localhost`         | Host the browser uses to reach the instance                  |
| `PREVIEW_SITE_PORT`           | `3000`              | Published port of the site                                   |
| `PREVIEW_ADMIN_PORT`          | `8000`              | Published port of the admin (and the api below `/api`)       |
| `PREVIEW_IDP_PORT`            | `8080`              | Published port of the identity provider                      |
| `PREVIEW_BIND`                | `127.0.0.1`         | Interface the ports are published on, `0.0.0.0` for a server |
| `PREVIEW_LOAD_FIXTURES`       | `true`              | Create demo content on the first start of an instance        |
| `PREVIEW_COOKIE_SECRET`       | a fixed dev value   | Cookie secret of the auth proxy                              |
| `PREVIEW_COOKIE_SECURE`       | `false`             | Set to `true` when the preview is served over https          |
| `PREVIEW_CORS_ALLOWED_ORIGIN` | `.*`                | `CORS_ALLOWED_ORIGIN` of the api                             |

The remaining values (database password, imgproxy key, dam secret, ...) default to the
development values from `.env` and can be overridden with environment variables of the same name.

## How it works

- **One Dockerfile per application** (`Api.Dockerfile`, `Admin.Dockerfile`, `Site.Dockerfile`),
  derived from the ones in `.docker-compose/`. The build context is the repository root, so the
  files that `setup-project-files.js` symlinks during a local installation (`schema.gql`,
  `block-meta.json`, `dextinity-config.json`, `site-configs.d.ts`) can be copied from their
  original location. Dependencies are installed before the sources are copied, so that a source
  change doesn't invalidate the `npm ci` layer.
- **`Tools.Dockerfile`** installs the root `package.json` and provides the two services that are
  npm packages: `@dextinity/cli` for the site-configs and `dev-oidc-provider` as identity provider.
- **Site configs** contain the public host and port of the instance, so they can't be baked into
  the images. The `site-configs` service generates them on every `docker compose up` into a
  volume, `entrypoint.sh` of api, admin and site reads them from there.
- **Login**: the browser reaches the identity provider under `PREVIEW_HOST:PREVIEW_IDP_PORT`,
  the auth proxy reaches it under `idp:8080`. That's why oidc discovery is turned off and the
  endpoints are configured explicitly in `docker-compose.preview.yml`.
- **Fixtures** drop all tables, so they are only loaded on the first start of an instance
  (marker file on the uploads volume). Set `PREVIEW_LOAD_FIXTURES=false` to start with an
  empty database.
- Tracing (jaeger) and valkey are not part of the preview, to keep it small and fast.

## Notes

- `PREVIEW_SITE_PORT` must be part of the url the browser uses, because the site matches the
  `Host` header against the domains of the site configs. A preview on port 80 or 443 (without
  port in the url) needs an adjustment in `site-configs/main.ts`.
- The preview is served over plain http. Behind an https proxy set `PREVIEW_COOKIE_SECURE=true`.
