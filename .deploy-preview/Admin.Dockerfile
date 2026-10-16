# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm
WORKDIR /app/admin

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY .npmrc ./
COPY admin/package.json admin/package-lock.json ./
# The postinstall script of admin installs the dependencies of admin/server.
COPY admin/server/package.json admin/server/package-lock.json ./server/
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY admin ./
# Files that setup-project-files.js symlinks during a local installation.
COPY api/schema.gql api/block-meta.json ./
COPY api/src/dextinity-config.json site-configs/site-configs.d.ts ./src/
# intl-update.sh clones the translations; the .git directories are only clone metadata.
RUN ./intl-update.sh && rm -rf lang/*/.git && npm run build

# The build is static. admin/server injects the environment variables into index.html when it
# starts and serves ./build relative to this directory.
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server"]
