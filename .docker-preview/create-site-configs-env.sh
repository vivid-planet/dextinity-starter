#!/usr/bin/env bash
set -e

# Renders site-configs/*.ts for the preview host into .env.site-configs.preview, which
# docker-compose.preview.yml injects into api, admin and site.
#
# Run this before starting the preview environment, and again whenever PREVIEW_HOST or
# anything in site-configs/ changes. The host defaults to localhost:8080:
#
#   ./.docker-preview/create-site-configs-env.sh
#   PREVIEW_HOST=pr-123.example.com ./.docker-preview/create-site-configs-env.sh

cd "$(dirname "$0")/.."

if [[ -s "$HOME/.nvm/nvm.sh" ]]
then
    . "$HOME/.nvm/nvm.sh"
    nvm use
fi

if [[ ! -x ./node_modules/.bin/dextinity ]]
then
    echo "Dependencies of the root package are missing, run \"npm install\" first." >&2
    exit 1
fi

SITE_DOMAIN="${PREVIEW_HOST:-localhost:8080}" ./node_modules/.bin/dotenv -e .env.secrets -e .env.local -e .env -- \
    ./node_modules/.bin/dextinity inject-site-configs \
    -f site-configs/site-configs.ts \
    -i .env.site-configs.tpl \
    -o .env.site-configs.preview \
    --base64
