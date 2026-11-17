FROM registry.access.redhat.com/ubi10/nodejs-24-minimal:latest

COPY --chown=1001:0 ./ ./
COPY --from=site-configs ./site-configs.d.ts ./src/site-configs.d.ts

RUN npm ci && \
    npm run build && \
    npm prune --omit=dev

CMD node --import ./dist/tracing.js dist/console.js migrate && node --import ./dist/tracing.js dist/main.js
