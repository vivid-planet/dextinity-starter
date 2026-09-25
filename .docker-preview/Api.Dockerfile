# Preview build of the api. Build context is the repository root.
FROM mirror.gcr.io/library/node:24 AS build

WORKDIR /app
RUN chown node:node /app
USER node

# Dependencies first: a source change doesn't invalidate this (slow) layer
COPY --chown=node:node .npmrc ./
COPY --chown=node:node api/package.json api/package-lock.json ./
RUN npm ci --include=dev

COPY --chown=node:node api/ ./
COPY --chown=node:node site-configs/site-configs.d.ts ./src/site-configs.d.ts

# Blob storage of the api (FILE_STORAGE_PATH=uploads), shared with imgproxy through a volume.
# Created here so that the volume inherits the ownership of the node user.
RUN npm run build && npm prune --omit=dev && mkdir -p uploads

# Second stage, so the build dependencies removed by "npm prune" are not kept in a lower layer
FROM mirror.gcr.io/library/node:24

# Mount point for the site-configs generated at startup (see entrypoint.sh)
RUN mkdir -p /site-configs /app && chown node:node /site-configs /app
COPY .docker-preview/entrypoint.sh .docker-preview/api-start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/api-start.sh

WORKDIR /app
USER node
COPY --from=build --chown=node:node /app /app

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/local/bin/api-start.sh"]
