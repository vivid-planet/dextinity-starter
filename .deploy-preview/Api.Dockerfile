# syntax=docker/dockerfile:1

FROM mirror.gcr.io/library/node:24-bookworm
WORKDIR /app/api

# The manifests are copied on their own, so that a source change does not invalidate the install.
COPY .npmrc ./
COPY api/package.json api/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY api ./
COPY site-configs/site-configs.d.ts ./src/site-configs.d.ts
# The prebuild script runs the api-generator.
RUN npm run build

# Blob storage of the api (FILE_STORAGE_PATH=uploads), shared with imgproxy through a volume.
RUN mkdir -p uploads

COPY .deploy-preview/api-start.sh /api-start.sh
ENV NODE_ENV=production
EXPOSE 4000
CMD ["/api-start.sh"]
