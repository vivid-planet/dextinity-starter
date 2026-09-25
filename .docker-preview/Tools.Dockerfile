# Helper image for the two services that are npm packages of the root package.json:
#   - site-configs: @dextinity/cli inject-site-configs
#   - idp:          dev-oidc-provider
# Build context is the repository root.
FROM mirror.gcr.io/library/node:24

# The generated site-configs are shared with api, admin and site through a volume
RUN mkdir -p /site-configs && chown node:node /site-configs

WORKDIR /app
RUN chown node:node /app
USER node

# --ignore-scripts: "npm run prepare" (husky) needs a git repository, which is not in the image
COPY --chown=node:node .npmrc package.json package-lock.json tsconfig.json ./
RUN npm ci --ignore-scripts --include=dev

COPY --chown=node:node site-configs/ ./site-configs/
COPY --chown=node:node .env.site-configs.tpl ./
COPY --chown=node:node api/src/auth/static-users.ts ./api/src/auth/static-users.ts
COPY --chown=node:node .docker-preview/dev-oidc-provider.config.mts ./
