# Helper image for the two services that are npm packages of the root package.json:
#   - site-configs: @dextinity/cli inject-site-configs
#   - idp:          dev-oidc-provider
# Build context is the repository root.
FROM registry.access.redhat.com/ubi10/nodejs-24-minimal:latest

USER 0
# The generated site-configs are shared with api, admin and site through a volume
RUN mkdir -p /site-configs && chown 1001:0 /site-configs

WORKDIR /opt/app-root/src
USER 1001

# --ignore-scripts: "npm run prepare" (husky) needs a git repository, which is not in the image
COPY --chown=1001:0 .npmrc package.json package-lock.json tsconfig.json ./
RUN npm ci --ignore-scripts --include=dev

COPY --chown=1001:0 site-configs/ ./site-configs/
COPY --chown=1001:0 .env.site-configs.tpl ./
COPY --chown=1001:0 api/src/auth/static-users.ts ./api/src/auth/static-users.ts
COPY --chown=1001:0 .docker-preview/dev-oidc-provider.config.mts ./
