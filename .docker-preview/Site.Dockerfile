# Preview build of the site. Build context is the repository root.
FROM registry.access.redhat.com/ubi10/nodejs-24:latest

USER 0
# Mount point for the site-configs generated at startup (see entrypoint.sh)
RUN mkdir -p /site-configs && chown 1001:0 /site-configs
COPY .docker-preview/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /opt/app-root/src
USER 1001

# Dependencies first: a source change doesn't invalidate this (slow) layer
COPY --chown=1001:0 .npmrc ./
COPY --chown=1001:0 site/package.json site/package-lock.json ./
RUN npm ci --include=dev

COPY --chown=1001:0 site/ ./
# Files that are symlinked by setup-project-files.js during local installation
COPY --chown=1001:0 api/schema.gql api/block-meta.json ./
COPY --chown=1001:0 api/src/dextinity-config.json ./src/dextinity-config.json
COPY --chown=1001:0 site-configs/site-configs.d.ts ./src/site-configs.d.ts

RUN ./intl-update.sh && npm run build && npm prune --omit=dev

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "dist/server.js"]
