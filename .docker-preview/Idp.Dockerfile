# syntax=docker/dockerfile:1

# Development OIDC provider for the preview environment, see docker-compose.preview.yml.
# Serves the static users from api/src/auth/static-users.ts, just like `npm run dev` does.

ARG NODE_BUILD_IMAGE=mirror.gcr.io/library/node:24-bookworm
ARG NODE_RUNTIME_IMAGE=mirror.gcr.io/library/node:24-bookworm-slim

# Keep this stage identical to the site-configs stage in the app Dockerfiles, so they share its cache.
FROM ${NODE_BUILD_IMAGE} AS root-deps
ENV npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
WORKDIR /app
COPY .npmrc package.json package-lock.json ./
# --ignore-scripts skips the husky prepare script, which needs a .git directory.
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts

FROM ${NODE_RUNTIME_IMAGE}
# Keep koa out of production mode, so errors of this development-only provider end up in the logs.
ENV NODE_ENV=development
WORKDIR /app
COPY --from=root-deps /app/node_modules ./node_modules
COPY package.json tsconfig.json dev-oidc-provider.config.mts ./
COPY api/src/auth/static-users.ts ./api/src/auth/static-users.ts
USER node
EXPOSE 8080
CMD ["node", "node_modules/.bin/dev-oidc-provider"]
