# Preview build of the site. Build context is the repository root.
FROM mirror.gcr.io/library/node:24 AS build

WORKDIR /app
RUN chown node:node /app
USER node

# Dependencies first: a source change doesn't invalidate this (slow) layer
COPY --chown=node:node .npmrc ./
COPY --chown=node:node site/package.json site/package-lock.json ./
RUN npm ci --include=dev

COPY --chown=node:node site/ ./
# Files that are symlinked by setup-project-files.js during local installation
COPY --chown=node:node api/schema.gql api/block-meta.json ./
COPY --chown=node:node api/src/dextinity-config.json ./src/dextinity-config.json
COPY --chown=node:node site-configs/site-configs.d.ts ./src/site-configs.d.ts

# .next/cache only holds the build cache of next, it is not needed to run the site
RUN ./intl-update.sh && npm run build && npm prune --omit=dev && rm -rf .next/cache

# Second stage, so the build dependencies removed by "npm prune" are not kept in a lower layer
FROM mirror.gcr.io/library/node:24

# Mount point for the site-configs generated at startup (see entrypoint.sh)
RUN mkdir -p /site-configs /app && chown node:node /site-configs /app
COPY .docker-preview/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app
USER node
COPY --from=build --chown=node:node /app /app

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "dist/server.js"]
