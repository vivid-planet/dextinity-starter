#!/usr/bin/env bash
set -e

# Starts this project as a preview environment: renders the site configs for the preview host and
# brings the compose project up. Everything project specific happens here, so that a preview
# controller only has to run this script and gets a running compose project.
#
# Configured through the environment, all optional:
#
#   COMPOSE_PROJECT_NAME      compose project to create (default dextinity-starter-deploy-preview)
#   DEPLOY_PREVIEW_PORT       host port the environment is published on (default 8080)
#   DEPLOY_PREVIEW_HOST       public host incl. port (default preview.localhost:<DEPLOY_PREVIEW_PORT>)
#   DEPLOY_PREVIEW_SCHEME     http or https (default http)
#   DEPLOY_PREVIEW_URLS_FILE  file to report the urls of this preview to, one "<name>=<url>" per line
#
# Without any of them it starts the preview environment on http://preview.localhost:8080.
#
# Everything besides the main site lives one label next to the base domain and not below it -
# admin--<host> and secondary--<host>, not admin.<host> - so that one wildcard certificate covers it.

cd "$(dirname "$0")"

export DEPLOY_PREVIEW_PORT="${DEPLOY_PREVIEW_PORT:-8080}"
export DEPLOY_PREVIEW_SCHEME="${DEPLOY_PREVIEW_SCHEME:-http}"
export DEPLOY_PREVIEW_HOST="${DEPLOY_PREVIEW_HOST:-preview.localhost:$DEPLOY_PREVIEW_PORT}"
# The auth proxy may only send its session cookie over https when the preview is served over https.
export PREVIEW_COOKIE_SECURE="${PREVIEW_COOKIE_SECURE:-$([[ $DEPLOY_PREVIEW_SCHEME == https ]] && echo true || echo false)}"

if [[ -s "$HOME/.nvm/nvm.sh" ]]
then
    . "$HOME/.nvm/nvm.sh"
    nvm install
fi

# The images do not know the preview host: the site configs are rendered for it here and injected
# into api, admin and site by the compose file. Rendering needs the root package installed.
# npm ci and not npm install, so that running the preview never rewrites package-lock.json.
[[ -x ./node_modules/.bin/dextinity ]] || npm ci --no-audit --no-fund
SITE_DOMAIN="$DEPLOY_PREVIEW_HOST" ./node_modules/.bin/dextinity inject-site-configs \
    -f site-configs/site-configs.ts \
    -i .env.site-configs.tpl \
    -o .env.site-configs.deploy-preview \
    --base64

# --project-directory keeps the repository root the base of the build contexts and of the .env
# files, although the compose file itself lives in .deploy-preview/.
docker compose -p "${COMPOSE_PROJECT_NAME:-dextinity-starter-deploy-preview}" -f .deploy-preview/docker-compose.yml \
    --project-directory . up --build -d --wait

# Tell the caller which domains this project serves, so it can link to them.
if [[ -n "${DEPLOY_PREVIEW_URLS_FILE:-}" ]]
then
    cat > "$DEPLOY_PREVIEW_URLS_FILE" <<URLS
Site=$DEPLOY_PREVIEW_SCHEME://$DEPLOY_PREVIEW_HOST
Admin=$DEPLOY_PREVIEW_SCHEME://admin--$DEPLOY_PREVIEW_HOST
URLS
fi
