# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm

# WORKDIR would create the directory as root, so it is created and handed over first.
RUN mkdir -p /app/api && chown node:node /app/api
WORKDIR /app/api
USER node

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY --chown=node:node .npmrc ./
COPY --chown=node:node api/package.json api/package-lock.json ./
# uid/gid: the cache mount would belong to root and npm could not write it.
RUN --mount=type=cache,target=/home/node/.npm,uid=1000,gid=1000 npm ci --no-audit --no-fund

COPY --chown=node:node api ./
COPY --chown=node:node site-configs/site-configs.d.ts ./src/site-configs.d.ts
RUN npm run build

# Blob storage (FILE_STORAGE_PATH), created here so that a fresh volume inherits node's ownership.
RUN mkdir -p uploads

COPY --chown=node:node .deploy-preview/api-start.sh /api-start.sh
ENV NODE_ENV=production
EXPOSE 4000
CMD ["/api-start.sh"]
