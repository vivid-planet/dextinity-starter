# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm

# WORKDIR would create the directory as root, so it is created and handed over first.
RUN mkdir -p /app/admin && chown node:node /app/admin
WORKDIR /app/admin
USER node

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY --chown=node:node .npmrc ./
COPY --chown=node:node admin/package.json admin/package-lock.json ./
# The postinstall script of admin installs the dependencies of admin/server.
COPY --chown=node:node admin/server/package.json admin/server/package-lock.json ./server/
# uid/gid: the cache mount would belong to root and npm could not write it.
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci --no-audit --no-fund

COPY --chown=node:node admin ./
# Files that setup-project-files.js symlinks during a local installation.
COPY --chown=node:node api/schema.gql api/block-meta.json ./
COPY --chown=node:node api/src/dextinity-config.json site-configs/site-configs.d.ts ./src/
# intl-update.sh clones the translations; the .git directories are only clone metadata.
RUN ./intl-update.sh && rm -rf lang/*/.git && npm run build

# admin/server injects the environment variables into index.html and serves ./build from here.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server"]
