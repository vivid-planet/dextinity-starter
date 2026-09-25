# Preview build of the api. Build context is the repository root.
FROM registry.access.redhat.com/ubi10/nodejs-24-minimal:latest

USER 0
# Mount point for the site-configs generated at startup (see entrypoint.sh)
RUN mkdir -p /site-configs && chown 1001:0 /site-configs
COPY .docker-preview/entrypoint.sh .docker-preview/api-start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/api-start.sh

WORKDIR /opt/app-root/src
USER 1001

# Dependencies first: a source change doesn't invalidate this (slow) layer
COPY --chown=1001:0 .npmrc ./
COPY --chown=1001:0 api/package.json api/package-lock.json ./
RUN npm ci --include=dev

COPY --chown=1001:0 api/ ./
COPY --chown=1001:0 site-configs/site-configs.d.ts ./src/site-configs.d.ts

RUN npm run build && npm prune --omit=dev

# Blob storage of the api (FILE_STORAGE_PATH=uploads), shared with imgproxy through a volume.
# Created here so that the volume inherits the ownership of user 1001.
RUN mkdir -p uploads

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/local/bin/api-start.sh"]
