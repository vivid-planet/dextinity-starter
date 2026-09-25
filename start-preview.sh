#!/usr/bin/env bash
set -e

# Starts this project as a preview environment. Everything project specific happens here, so
# that a preview controller only has to run this script and gets a running compose project.
#
# Configured through the environment, all optional:
#
#   COMPOSE_PROJECT_NAME  compose project to create (default dextinity-preview)
#   PREVIEW_PORT          host port the environment is published on (default 8080)
#   PREVIEW_DOMAIN        base domain (default localhost)
#   PREVIEW_HOST          public host incl. port (default <PREVIEW_DOMAIN>:<PREVIEW_PORT>)
#   PREVIEW_SCHEME        http or https (default http)
#   PREVIEW_URLS          file to report the urls of this preview to, one "<name>=<url>" per line
#
# Without any of them it starts the preview environment on http://localhost:8080.

cd "$(dirname "$0")"

if [[ -s "$HOME/.nvm/nvm.sh" ]]
then
    . "$HOME/.nvm/nvm.sh"
    nvm install
fi

# The site-configs script needs the dependencies of the root package.
if [[ ! -x ./node_modules/.bin/dextinity ]]
then
    npm install --no-audit --no-fund
fi

./.docker-preview/create-site-configs-env.sh

docker compose -p "${COMPOSE_PROJECT_NAME:-dextinity-preview}" -f docker-compose.preview.yml up --build -d --wait

# Tell the caller which domains this project serves, so it can link to them.
if [[ -n "${PREVIEW_URLS:-}" ]]
then
    scheme="${PREVIEW_SCHEME:-http}"
    host="${PREVIEW_HOST:-${PREVIEW_DOMAIN:-localhost}:${PREVIEW_PORT:-8080}}"
    cat > "$PREVIEW_URLS" <<EOF
Site=$scheme://$host
Secondary=$scheme://secondary.$host
Admin=$scheme://admin.$host
EOF
fi
