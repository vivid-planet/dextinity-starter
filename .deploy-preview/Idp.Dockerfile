# syntax=docker/dockerfile:1

# The identity provider for the preview is dev-oidc-provider, the same one `npm run dev` starts
# locally. It is a dev dependency of the root package, so the root manifests are installed here.
# The config and the static users keep the same layout as in the repository, so that
# dev-oidc-provider.config.mts resolves them.
FROM mirror.gcr.io/library/node:24-bookworm
WORKDIR /app

# --ignore-scripts: "npm run prepare" (husky) needs a git repository, which is not in the image.
COPY .npmrc package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts --no-audit --no-fund

COPY api/src/auth/static-users.ts ./api/src/auth/static-users.ts
COPY .deploy-preview/dev-oidc-provider.config.mts ./

EXPOSE 8080
CMD ["./node_modules/.bin/dev-oidc-provider"]
