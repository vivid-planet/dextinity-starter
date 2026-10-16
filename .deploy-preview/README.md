# Deploy Preview Environment

Runs the complete application - api, admin, site and everything they need - in Docker.
It is meant for preview environments, for example to look at a pull request before it is merged.

Dependencies are installed and everything is built inside the images, so neither `./install.sh`
nor a build has to run on the host. The one thing prepared outside is the site-configs env file,
which needs the root package installed - `start-deploy-preview.sh` does that itself.

It is **not** a development environment: there is no hot reloading and no watch mode.
Everything is built once, production style, and then started. For development use `npm run dev`.

For the deployment to a server with traefik and letsencrypt see [`.docker-compose/`](../.docker-compose).

## Requirements

Docker (with compose), node for the site-configs step, and network access during the build:
the npm registry, `mirror.gcr.io` (all images) and github.com (the translations are cloned by
`intl-update.sh`).

## Quick start

```bash
./start-deploy-preview.sh
```

The script renders `site-configs/*.ts` for `DEPLOY_PREVIEW_HOST` into `.env.site-configs.deploy-preview` - the
images themselves do not know the preview host - and then brings the compose project up, blocking
until api and site report healthy. Run it again whenever `DEPLOY_PREVIEW_HOST` or anything in
`site-configs/` changes.

Afterwards `docker compose -f .deploy-preview/docker-compose.yml --project-directory . logs|ps|down`
work directly; to start or restart the environment, run the script again.

| Application      | URL                                      |
| ---------------- | ---------------------------------------- |
| Site (main)      | http://preview.localhost:8080            |
| Site (secondary) | http://secondary--preview.localhost:8080 |
| Admin            | http://admin--preview.localhost:8080     |

Everything besides the main site sits next to the base domain, not below it: `secondary--<host>`
and `admin--<host>`, not `secondary.<host>`. See [Host names](#host-names).

Every site config gets its own host: the main site is served under the preview host itself, every
other one under the prefix of its `site-configs/<name>.ts`. The admin login works like in local
development: the identity provider is `dev-oidc-provider`, where every static user of
`api/src/auth/static-users.ts` can log in without a password.

Follow the logs, stop it again, and remove the database:

```bash
docker compose -f .deploy-preview/docker-compose.yml --project-directory . logs -f
docker compose -f .deploy-preview/docker-compose.yml --project-directory . down
docker compose -f .deploy-preview/docker-compose.yml --project-directory . down --volumes
```

## Several environments at the same time

Only one port is published, so a second environment needs a different port and its own
compose project name:

```bash
DEPLOY_PREVIEW_PORT=8081 COMPOSE_PROJECT_NAME=pr-123 ./start-deploy-preview.sh
```

The project name keeps containers, networks and volumes of the two environments apart.
`.env.site-configs.deploy-preview` is not, so start one environment after the other, not both at once.

## Configuration

All variables are optional.

| Variable                   | Default                                  | Description                                                 |
| -------------------------- | ---------------------------------------- | ----------------------------------------------------------- |
| `DEPLOY_PREVIEW_PORT`      | `8080`                                   | Host port the environment is published on                   |
| `DEPLOY_PREVIEW_HOST`      | `preview.localhost:$DEPLOY_PREVIEW_PORT` | Public host used in all urls, see [Host names](#host-names) |
| `DEPLOY_PREVIEW_SCHEME`    | `http`                                   | Set to `https` when TLS is terminated by an upstream proxy  |
| `DEPLOY_PREVIEW_URLS_FILE` | unset                                    | File to report the urls to, one `<name>=<url>` per line     |

`DEPLOY_PREVIEW_HOST` is what keeps the rendered site-configs and the urls in the compose file in sync:
`start-deploy-preview.sh` renders the configs for it and passes it on to compose. Everything else - imgproxy
keys, `DAM_SECRET`, acl defaults, database credentials - is taken from `.env`, which docker compose
loads automatically. The preview environment therefore uses the same non-secret development values
as the local development setup.

### Host names

Every host of the environment is the base domain with a prefix in front of it rather than a
subdomain of it: `$DEPLOY_PREVIEW_HOST` serves the main site, `<name>--$DEPLOY_PREVIEW_HOST` the other site
configs, `admin--$DEPLOY_PREVIEW_HOST` the admin and the api under `/api`, and `idp--$DEPLOY_PREVIEW_HOST` the
identity provider.

A wildcard certificate covers one dns label, so `*.example.com` matches `pr-123.example.com` but
not `admin.pr-123.example.com`. With the prefixes every host of every preview stays one label
deep and a single `*.example.com` certificate is enough, which is what makes this work over https
at all. `--` separates them because a host name generated from a branch never contains it. The
site prefixes come from `site-configs/local-domain.ts`, everything else from the
[Caddyfile](Caddyfile) and the compose file.

`*.localhost` resolves to `127.0.0.1` in all current browsers, and so does
`admin--preview.localhost`, because it ends in `.localhost` too - which is why the default base
domain is `preview.localhost` and not `localhost`. For other setups add the host names to
`/etc/hosts`.

### Behind another reverse proxy

To serve a preview under a real domain, point an upstream proxy at `DEPLOY_PREVIEW_PORT` and forward
`<domain>`, `admin--<domain>`, `idp--<domain>` and the host of every site config to it, keeping
the original `Host` header:

```bash
export DEPLOY_PREVIEW_PORT=30123
export DEPLOY_PREVIEW_HOST=pr-123.example.com
export DEPLOY_PREVIEW_SCHEME=https
export COMPOSE_PROJECT_NAME=pr-123

./start-deploy-preview.sh
```

## How it works

```
                                      ┌────────────────────────────────────────┐
  :$DEPLOY_PREVIEW_PORT ──▶ caddy ──▶ │ admin--<host>   -> authproxy -> admin  │
                                      │                              -> api    │
                                      │ idp--<host>     -> idp                 │
                                      │ everything else -> site                │
                                      └────────────────────────────────────────┘

  api ──▶ postgres, imgproxy          site ──▶ api (internal)
```

- **caddy** is the only container with a published port, which is what makes multiple parallel
  environments possible. It routes by how the host name starts, so it does not need to know the
  preview host, see [Caddyfile](Caddyfile).
- The admin host serves the api under `/api` and the admin everywhere else, with **oauth2-proxy**
  in front of both - the same setup `npm run dev` starts locally. The browser is redirected to the
  identity provider under its public host, while oauth2-proxy and the api reach it directly inside
  the network; that is why oidc discovery is turned off and the endpoints are configured
  explicitly in the compose file.
- Postgres runs without `fsync`, the node processes have a heap limit and tracing is disabled -
  preview data is disposable and the environments should stay small.

### Images

One Dockerfile per service, each one building only its own package:

| Dockerfile                           | Contains                                                           |
| ------------------------------------ | ------------------------------------------------------------------ |
| [Api.Dockerfile](Api.Dockerfile)     | `npm ci` + `npm run build` for `api/`, served by `dist/main`       |
| [Admin.Dockerfile](Admin.Dockerfile) | `npm ci` + `npm run build` for `admin/`, served by `admin/server`  |
| [Site.Dockerfile](Site.Dockerfile)   | `npm ci` + `npm run build` for `site/`, served by `dist/server.js` |
| [Idp.Dockerfile](Idp.Dockerfile)     | the root package, which has `dev-oidc-provider` as dev dependency  |

All of them use the repository root as build context, because every package needs files from the
others (`api/schema.gql`, `api/block-meta.json`, `site-configs/site-configs.d.ts`). The
[.dockerignore](../.dockerignore) excludes everything that install and build generate, so a build
from a fresh clone and a build from a local working copy produce the same image.

Each image is built and run in a single stage: the images never leave the machine that built them,
so their size does not matter and a second stage would only make the Dockerfiles longer. What does
matter is the build time, which is why the manifests are copied before the sources (a source change
then does not invalidate `npm ci`) and why the npm cache and the Next.js build cache are mounted.

The images contain no environment-specific configuration: urls, secrets and the rendered
site-configs are all injected by the compose file. The same image can therefore serve any preview
host, and only `docker compose up` has to be repeated for a second environment.

## Limitations

- Anyone who can reach the admin host can log in as any static user without a password, because the
  identity provider is the development one. Do not expose an environment to the internet without
  putting authentication in front of it.
- The applications run as root inside their containers, which keeps the images plain checkouts that
  were built in place. That is unproblematic for an environment on your own machine and one more
  reason not to expose one to the internet.
- Images and other uploads are stored in a volume inside the environment. `down --volumes`
  deletes them together with the database.
- The scheme is `http` unless `DEPLOY_PREVIEW_SCHEME` says otherwise; there is no built-in TLS. Admin and
  site send the `upgrade-insecure-requests` csp directive only when their own public url is https,
  so an http preview does not break on it.
- The fixtures fill the database with demo content on first start. They only run once per
  database, guarded by a marker file in the uploads volume. Delete the volumes to start over.
- `.env.site-configs.deploy-preview` is a single file in the repository, so two environments with
  different hosts cannot be rendered at the same time - render, start, then render the next.
