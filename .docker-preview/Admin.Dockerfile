# syntax=docker/dockerfile:1

# Admin for the preview environment, see docker-compose.preview.yml.
#
# Nothing has to be installed or built on the host: the build context is a plain
# checkout of the repository root. It is the root and not admin/, because the admin
# needs the api schema and site-configs/.

ARG NODE_BUILD_IMAGE=mirror.gcr.io/library/node:24-bookworm
ARG NODE_RUNTIME_IMAGE=mirror.gcr.io/library/node:24-bookworm-slim

# The full node image is used for the build, because intl-update.sh needs git.
FROM ${NODE_BUILD_IMAGE} AS build
ENV npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
WORKDIR /app/admin
COPY .npmrc admin/package.json admin/package-lock.json ./
# The postinstall script of admin installs the dependencies of admin/server.
COPY admin/server/package.json admin/server/package-lock.json ./server/
RUN --mount=type=cache,target=/root/.npm npm ci
COPY admin ./
COPY api/schema.gql api/block-meta.json ./
COPY api/src/dextinity-config.json site-configs/site-configs.d.ts ./src/
RUN ./intl-update.sh && npm run build

FROM ${NODE_RUNTIME_IMAGE}
ENV NODE_ENV=production
WORKDIR /app/admin
# The build is static. admin/server injects the environment variables into index.html
# when it starts.
COPY --from=build /app/admin/build ./build
COPY --from=build /app/admin/server ./server
USER node
EXPOSE 3000
CMD ["node", "server"]
