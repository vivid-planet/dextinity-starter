# Preview build of the admin. Build context is the repository root.
FROM registry.access.redhat.com/ubi10/nodejs-24:latest

USER 0
# Mount point for the site-configs generated at startup (see entrypoint.sh)
RUN mkdir -p /site-configs && chown 1001:0 /site-configs
COPY .docker-preview/entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

WORKDIR /opt/app-root/src
USER 1001

# Dependencies first: a source change doesn't invalidate this (slow) layer.
# server/package.json is needed as well, it is installed by the postinstall script of the admin.
COPY --chown=1001:0 .npmrc ./
COPY --chown=1001:0 admin/package.json admin/package-lock.json ./
COPY --chown=1001:0 admin/server/package.json admin/server/package-lock.json ./server/
RUN npm ci --include=dev

COPY --chown=1001:0 admin/ ./
# Files that are symlinked by setup-project-files.js during local installation
COPY --chown=1001:0 api/schema.gql api/block-meta.json ./
COPY --chown=1001:0 api/src/dextinity-config.json ./src/dextinity-config.json
COPY --chown=1001:0 site-configs/site-configs.d.ts ./src/site-configs.d.ts

# The admin is a static build served by server/index.js, which only needs server/node_modules
RUN ./intl-update.sh && npm run build && rm -rf ./node_modules

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["node", "server"]
