# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm

# WORKDIR would create the directory as root, so it is created and handed over first.
RUN mkdir -p /app/site && chown node:node /app/site
WORKDIR /app/site
USER node

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY --chown=node:node .npmrc ./
COPY --chown=node:node site/package.json site/package-lock.json ./
# uid/gid: the cache mount would belong to root and npm could not write it.
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci --no-audit --no-fund

COPY --chown=node:node site ./
# Files that setup-project-files.js symlinks during a local installation.
COPY --chown=node:node api/schema.gql api/block-meta.json ./
COPY --chown=node:node api/src/dextinity-config.json site-configs/site-configs.d.ts ./src/
ENV NODE_OPTIONS=--max-old-space-size=4096
# BuildKit creates the parent of a cache mount as root, and next writes .next/trace next to it.
RUN mkdir -p .next
# intl-update.sh clones the translations; the .git directories are only clone metadata.
RUN --mount=type=cache,target=/app/site/.next/cache,uid=1000,gid=1000 \
    ./intl-update.sh && rm -rf lang/*/.git && npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
