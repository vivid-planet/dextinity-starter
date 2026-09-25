# syntax=docker/dockerfile:1

# Site for the preview environment, see docker-compose.preview.yml.
#
# Nothing has to be installed or built on the host: the build context is a plain
# checkout of the repository root. It is the root and not site/, because the site
# needs the api schema and site-configs/.

ARG NODE_BUILD_IMAGE=mirror.gcr.io/library/node:24-bookworm
ARG NODE_RUNTIME_IMAGE=mirror.gcr.io/library/node:24-bookworm-slim

# The full node image is used for the build, because intl-update.sh needs git.
FROM ${NODE_BUILD_IMAGE} AS build
ENV npm_config_fund=false \
    npm_config_audit=false \
    npm_config_update_notifier=false
WORKDIR /app/site
COPY .npmrc site/package.json site/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY site ./
COPY api/schema.gql api/block-meta.json ./
COPY api/src/dextinity-config.json site-configs/site-configs.d.ts ./src/
RUN --mount=type=cache,target=/app/site/.next/cache \
    ./intl-update.sh && npm run build && npm prune --omit=dev

FROM ${NODE_RUNTIME_IMAGE}
ENV NODE_ENV=production
WORKDIR /app/site
COPY --from=build /app/site/package.json /app/site/next.config.mjs ./
COPY --from=build /app/site/node_modules ./node_modules
# Next writes its runtime caches into .next, so it has to belong to the user running it.
COPY --from=build --chown=node:node /app/site/.next ./.next
COPY --from=build /app/site/dist ./dist
COPY --from=build /app/site/public ./public
COPY --from=build /app/site/lang-compiled ./lang-compiled
# next.config.mjs imports src/dextinity-config.json at startup.
COPY --from=build /app/site/src/dextinity-config.json ./src/dextinity-config.json
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
