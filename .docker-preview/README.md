# Docker Preview Environment

Runs the complete application - api, admin, site and everything they need - in Docker.
It is meant for preview environments, for example to look at a pull request before it is merged.

Dependencies are installed and everything is built inside the images, so neither `./install.sh`
nor `npm run build` has to run on the host. The one thing prepared outside is the site-configs
env file, which needs the root package installed (`nvm use && npm install`).

It is **not** a development environment: there is no hot reloading and no watch mode.
Everything is built once, production style, and then started. For development use `npm run dev`.

## Quick start

```bash
./start-preview.sh
```

That installs the root dependencies if needed, renders `site-configs/*.ts` for `PREVIEW_HOST`
into `.env.site-configs.preview` and runs `docker compose up --build -d --wait`. It is also the
entry point a preview controller calls, which is why everything it needs comes from the
environment - see the header of the script.

The two steps can also be run by hand, for example to rebuild without re-rendering the configs:

```bash
./.docker-preview/create-site-configs-env.sh
docker compose -f .docker-preview/docker-compose.yml --project-directory . up --build -d
```

Render the site-configs again whenever `PREVIEW_HOST` or anything in `site-configs/` changes -
the images themselves do not know the preview host.

Run every compose command from the repository root and keep `--project-directory .`: the compose
file lives in this directory, but its build contexts, the `.env` it is interpolated with and
`.env.site-configs.preview` are all relative to the root. Without the option compose would look
for them next to the compose file.

| Application      | URL                                      |
| ---------------- | ---------------------------------------- |
| Site (main)      | http://preview.localhost:8080            |
| Site (secondary) | http://secondary--preview.localhost:8080 |
| Admin            | http://admin--preview.localhost:8080     |
| OIDC provider    | http://idp--preview.localhost:8080       |

Everything besides the main site sits next to the base domain, not below it: `admin--<host>`
and not `admin.<host>`. See [Host names](#host-names).

Log in to the admin with any of the static users from `api/src/auth/static-users.ts`.

Follow the logs, stop it again, and remove the database:

```bash
docker compose -f .docker-preview/docker-compose.yml --project-directory . logs -f
docker compose -f .docker-preview/docker-compose.yml --project-directory . down
docker compose -f .docker-preview/docker-compose.yml --project-directory . down --volumes
```

## Several environments at the same time

Only one port is published, so a second environment needs a different port and its own
compose project name:

```bash
PREVIEW_HOST=preview.localhost:8081 ./.docker-preview/create-site-configs-env.sh
PREVIEW_PORT=8081 docker compose -f .docker-preview/docker-compose.yml --project-directory . -p pr-123 up --build -d
```

The project name keeps containers, networks and volumes of the two environments apart.
`.env.site-configs.preview` is not, so render it right before starting an environment.

## Configuration

All variables are optional.

| Variable                | Default                         | Description                                                |
| ----------------------- | ------------------------------- | ---------------------------------------------------------- |
| `PREVIEW_PORT`          | `8080`                          | Host port the environment is published on                  |
| `PREVIEW_DOMAIN`        | `preview.localhost`             | Base domain, see [Host names](#host-names)                 |
| `PREVIEW_HOST`          | `$PREVIEW_DOMAIN:$PREVIEW_PORT` | Public host used in all urls                               |
| `PREVIEW_SCHEME`        | `http`                          | Set to `https` when TLS is terminated by an upstream proxy |
| `PREVIEW_LOAD_FIXTURES` | `1`                             | Fill the empty database with demo content on first start   |
| `PREVIEW_COOKIE_SECRET` | a fixed development value       | Cookie secret of the auth proxy (16, 24 or 32 characters)  |
| `PREVIEW_COOKIE_SECURE` | `false`                         | Set to `true` when the environment is served over https    |

`PREVIEW_HOST` is also read by `./.docker-preview/create-site-configs-env.sh`, which is what keeps
the rendered site-configs and the urls in the compose file in sync. Everything else - imgproxy
keys, `DAM_SECRET`, acl defaults, database credentials - is taken from `.env`, which docker
compose loads automatically. The preview environment therefore uses the same non-secret
development values as the local development setup.

### Host names

The environment serves four host names, and all of them are the base domain with a prefix in
front of it rather than a subdomain of it:

| Host                       | Serves                     |
| -------------------------- | -------------------------- |
| `$PREVIEW_HOST`            | site, main scope           |
| `secondary--$PREVIEW_HOST` | site, secondary scope      |
| `admin--$PREVIEW_HOST`     | admin and api under `/api` |
| `idp--$PREVIEW_HOST`       | the development idp        |

A wildcard certificate covers one dns label, so `*.example.com` matches `pr-123.example.com` but
not `admin.pr-123.example.com`. With the prefixes every host of every preview stays one label
deep and a single `*.example.com` certificate is enough, which is what makes this work over
https at all. `--` separates them because a host name generated from a branch never contains it.

`*.localhost` resolves to `127.0.0.1` in all current browsers, and so does
`admin--preview.localhost`, because it ends in `.localhost` too - which is why the default base
domain is `preview.localhost` and not `localhost`. For other setups either add the host names to
`/etc/hosts` or use a wildcard dns service, e.g. `PREVIEW_DOMAIN=127.0.0.1.nip.io`.

### Behind another reverse proxy

To serve a preview under a real domain, point an upstream proxy at `PREVIEW_PORT` and forward
`<domain>`, `secondary--<domain>`, `admin--<domain>` and `idp--<domain>` to it, keeping the
original `Host` header:

```bash
export PREVIEW_PORT=30123
export PREVIEW_DOMAIN=pr-123.example.com
export PREVIEW_HOST=pr-123.example.com
export PREVIEW_SCHEME=https
export PREVIEW_COOKIE_SECURE=true

./.docker-preview/create-site-configs-env.sh
docker compose -f .docker-preview/docker-compose.yml --project-directory . -p pr-123 up --build -d
```

For a host that is not `localhost` the rendered urls use `https`, so TLS has to be terminated
upstream.

## How it works

```
                               ┌───────────────────────────────┐
  :$PREVIEW_PORT ──▶ proxy ──▶ │ admin--<host>   -> auth-proxy │──▶ admin (static build)
        (caddy)                │ idp--<host>     -> idp        │──▶ api   (/api/*)
                               │ everything else -> site       │
                               └───────────────────────────────┘

  api ──▶ postgres, imgproxy          site ──▶ api (internal)
```

- **proxy** (caddy) is the only container with a published port, which is what makes multiple
  parallel environments possible. It routes by host name, see [Caddyfile](Caddyfile).
- **auth-proxy** (oauth2-proxy) authenticates the admin against **idp** (`dev-oidc-provider`)
  and forwards `/api/*` to the api and everything else to the admin.
- The idp is reachable under two addresses: the public one the browser is redirected to, and
  the internal one used for the server-to-server calls. That is why oidc discovery is skipped
  and the individual endpoints are configured explicitly.
- Postgres runs without `fsync`, the api and site processes have a small heap limit and tracing
  is disabled - preview data is disposable and the environments should stay small.

### Images

One Dockerfile per service, each one building only its own package:

| Dockerfile                           | Contains                                                           |
| ------------------------------------ | ------------------------------------------------------------------ |
| [Api.Dockerfile](Api.Dockerfile)     | `npm ci` + `npm run build` for `api/`, served by `dist/main`       |
| [Admin.Dockerfile](Admin.Dockerfile) | `npm ci` + `npm run build` for `admin/`, served by `admin/server`  |
| [Site.Dockerfile](Site.Dockerfile)   | `npm ci` + `npm run build` for `site/`, served by `dist/server.js` |
| [Idp.Dockerfile](Idp.Dockerfile)     | `dev-oidc-provider` from the root package                          |

All of them use the repository root as build context, because every package needs files from
the others (`api/schema.gql`, `api/block-meta.json`, `site-configs/site-configs.d.ts`). The
[.dockerignore](../.dockerignore) excludes everything that install and build generate, so a
build from a fresh clone and a build from a local working copy produce the same image.

The admin and site builds run with `NODE_OPTIONS=--max-old-space-size=4096`, because node
derives its default heap from the memory of the machine running the build - on a laptop that is
often 2 GB, which a large bundle exceeds with `JavaScript heap out of memory`. Docker itself
needs enough memory for that, at least 8 GB in Docker Desktop.

The images contain no environment-specific configuration at all: urls, secrets and the rendered
site-configs are all injected by the compose file. The same image can therefore serve any
preview host, and only `docker compose up` has to be repeated for a second environment.

## Limitations

- Images and other uploads are stored in a volume inside the environment. `down --volumes`
  deletes them together with the database.
- The scheme is `http` unless `PREVIEW_SCHEME` says otherwise; there is no built-in TLS.
- The fixtures only run once per database, guarded by a marker file in the uploads volume.
  Delete the volumes to start over.
- `.env.site-configs.preview` is a single file in the repository, so two environments with
  different hosts cannot be rendered at the same time - render, start, then render the next.
