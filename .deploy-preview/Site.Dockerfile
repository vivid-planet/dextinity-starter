# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm
WORKDIR /app/site

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY .npmrc ./
COPY site/package.json site/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY site ./
# Files that setup-project-files.js symlinks during a local installation.
COPY api/schema.gql api/block-meta.json ./
COPY api/src/dextinity-config.json site-configs/site-configs.d.ts ./src/
ENV NODE_OPTIONS=--max-old-space-size=4096
# intl-update.sh clones the translations; the .git directories are only clone metadata.
RUN --mount=type=cache,target=/app/site/.next/cache \
    ./intl-update.sh && rm -rf lang/*/.git && npm run build

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
