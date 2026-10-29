# Deploy Preview Environment

Runs the complete application - api, admin, site and everything they need - in Docker, for example
to look at a pull request before it is merged. Everything is installed and built inside the images,
so nothing but Docker and node has to be on the host.

It is **not** a development environment: no hot reloading, everything is built once, production
style. For development use `npm run dev`, for the deployment to a real server see
[`.docker-compose/`](../.docker-compose).

## Quick start

```bash
./start-deploy-preview.sh
```

| Application      | URL                                      |
| ---------------- | ---------------------------------------- |
| Site (main)      | http://preview.localhost:8080            |
| Site (secondary) | http://secondary--preview.localhost:8080 |
| Admin            | http://admin--preview.localhost:8080     |

The admin needs no password: every static user of `api/src/auth/static-users.ts` can log in, like
in local development.

Afterwards:

```bash
docker compose -f .deploy-preview/docker-compose.yml --project-directory . logs -f
docker compose -f .deploy-preview/docker-compose.yml --project-directory . down --volumes
```

To start, restart, or pick up a change in `site-configs/`, run the script again.

## Several environments at the same time

Only caddy publishes a port, so a second environment needs its own port and project name:

```bash
DEPLOY_PREVIEW_PORT=8081 COMPOSE_PROJECT_NAME=pr-123 ./start-deploy-preview.sh
```

`.env.site-configs.deploy-preview` is shared, so render and start one after the other.

## Configuration

| Variable                   | Default                                  | Description                                                |
| -------------------------- | ---------------------------------------- | ---------------------------------------------------------- |
| `DEPLOY_PREVIEW_PORT`      | `8080`                                   | Host port the environment is published on                  |
| `DEPLOY_PREVIEW_HOST`      | `preview.localhost:$DEPLOY_PREVIEW_PORT` | Public host used in all urls                               |
| `DEPLOY_PREVIEW_SCHEME`    | `http`                                   | Set to `https` when TLS is terminated by an upstream proxy |
| `DEPLOY_PREVIEW_URLS_FILE` | unset                                    | File to report the urls to, one `<name>=<url>` per line    |

Everything else - imgproxy keys, database credentials, acl defaults - comes from `.env`, so the
preview uses the same non-secret development values as `npm run dev`.

### Host names

Every host is the base domain with a prefix in front of it rather than a subdomain of it:
`admin--<host>` serves the admin and the api under `/api`, `idp--<host>` the identity provider, and
`<name>--<host>` every site config besides the main one. That keeps each host one dns label deep,
so a single `*.example.com` certificate covers a whole preview.

`*.localhost` resolves to `127.0.0.1` in browsers, which is why the default base domain is
`preview.localhost` and not `localhost`. For other host names add them to `/etc/hosts`.

### Behind another reverse proxy

Point an upstream proxy at `DEPLOY_PREVIEW_PORT`, forward `<domain>`, `admin--<domain>`,
`idp--<domain>` and the host of every site config to it, and keep the original `Host` header:

```bash
DEPLOY_PREVIEW_PORT=30123 DEPLOY_PREVIEW_HOST=pr-123.example.com DEPLOY_PREVIEW_SCHEME=https \
    COMPOSE_PROJECT_NAME=pr-123 ./start-deploy-preview.sh
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

caddy is the only container with a published port and routes by how the host name starts, so it
does not need to know the preview host. The build pulls from the npm registry, `mirror.gcr.io`,
`quay.io` and github.com.

## Limitations

- Anyone who reaches the admin can log in as any static user without a password. Do not expose an
  environment to the internet without putting authentication in front of it.
- There is no TLS of its own; set `DEPLOY_PREVIEW_SCHEME=https` when a proxy terminates it.
- The fixtures create demo content once per database, guarded by a marker in the uploads volume.
  `down --volumes` deletes the database and the uploads together.
