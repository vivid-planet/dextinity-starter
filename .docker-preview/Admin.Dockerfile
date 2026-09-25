# Preview build of the admin. Build context is the repository root.
FROM mirror.gcr.io/library/node:24 AS build

WORKDIR /app
RUN chown node:node /app
USER node

# Dependencies first: a source change doesn't invalidate this (slow) layer.
# server/package.json is needed as well, it is installed by the postinstall script of the admin.
COPY --chown=node:node .npmrc ./
COPY --chown=node:node admin/package.json admin/package-lock.json ./
COPY --chown=node:node admin/server/package.json admin/server/package-lock.json ./server/
RUN npm ci --include=dev

COPY --chown=node:node admin/ ./
# Files that are symlinked by setup-project-files.js during local installation
COPY --chown=node:node api/schema.gql api/block-meta.json ./
COPY --chown=node:node api/src/dextinity-config.json ./src/dextinity-config.json
COPY --chown=node:node site-configs/site-configs.d.ts ./src/site-configs.d.ts

# The admin is a static build served by server/index.js, which only needs server/node_modules
RUN ./intl-update.sh && npm run build && rm -rf ./node_modules

# Second stage, so the build dependencies removed above are not kept in a lower layer
FROM mirror.gcr.io/library/node:24

# Mount point for the site-configs generated at startup (see entrypoint.sh)
RUN mkdir -p /site-configs /app && chown node:node /site-configs /app
COPY .docker-preview/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /app
USER node
COPY --from=build --chown=node:node /app /app

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "server"]
