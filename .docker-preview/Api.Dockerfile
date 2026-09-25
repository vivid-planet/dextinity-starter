# syntax=docker/dockerfile:1

# API for the preview environment, see docker-compose.preview.yml.
#
# Nothing has to be installed or built on the host: the build context is a plain
# checkout of the repository root. It is the root and not api/, because the api
# needs site-configs/.

ARG NODE_BUILD_IMAGE=mirror.gcr.io/library/node:24-bookworm
ARG NODE_RUNTIME_IMAGE=mirror.gcr.io/library/node:24-bookworm-slim

FROM ${NODE_BUILD_IMAGE} AS build
ENV npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
WORKDIR /app/api
COPY .npmrc api/package.json api/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY api ./
COPY site-configs/site-configs.d.ts ./src/site-configs.d.ts
# The prebuild script runs the api-generator.
RUN npm run build && npm prune --omit=dev

FROM ${NODE_RUNTIME_IMAGE}
ENV NODE_ENV=production
WORKDIR /app/api
COPY --from=build /app/api/package.json ./
COPY --from=build /app/api/node_modules ./node_modules
COPY --from=build /app/api/dist ./dist
COPY api/public ./public
# Needed by the "fixtures" console command.
COPY api/src/db/fixtures/assets ./src/db/fixtures/assets
COPY .docker-preview/api-start.sh /api-start.sh
RUN chmod +x /api-start.sh && mkdir -p uploads && chown node:node uploads
USER node
EXPOSE 4000
CMD ["/api-start.sh"]
