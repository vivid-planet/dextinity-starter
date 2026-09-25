#!/usr/bin/env bash
#
# Starts a preview instance of the whole application in docker.
#
#   .docker-preview/preview.sh              # start (or update) an instance for the current branch
#   .docker-preview/preview.sh down         # stop it and delete its data
#
# Everything is scoped by PREVIEW_NAME, so several instances can run in parallel on one host.
# Free ports are picked automatically, unless they are set explicitly:
#
#   PREVIEW_NAME=pr-123 PREVIEW_SITE_PORT=3100 .docker-preview/preview.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

COMPOSE_FILE="docker-compose.preview.yml"

# One instance per name - containers, volumes and images are prefixed with it
if [[ -z "${PREVIEW_NAME:-}" ]]; then
    branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo preview)"
    PREVIEW_NAME="$(echo "$branch" | tr '[:upper:]' '[:lower:]' | tr -c '[:alnum:]_-' '-' | sed 's/-*$//')"
fi
export PREVIEW_NAME

if [[ "${1:-up}" == "down" ]]; then
    docker compose -f "$COMPOSE_FILE" down --volumes --remove-orphans
    exit 0
fi

# First free port starting at $1
free_port() {
    local port=$1
    while (exec 3<>"/dev/tcp/127.0.0.1/$port") 2>/dev/null; do
        port=$((port + 1))
    done
    echo "$port"
}

# Keep the ports of an already running instance, so that restarting doesn't change its urls
published_port() {
    docker compose -f "$COMPOSE_FILE" port "$1" "$2" 2>/dev/null | sed -n 's/.*:\([0-9]\+\)$/\1/p'
}
running_site_port="$(published_port site 3000)"
running_admin_port="$(published_port authproxy 4180)"
running_idp_port="$(published_port idp 8080)"

export PREVIEW_HOST="${PREVIEW_HOST:-localhost}"
export PREVIEW_SITE_PORT="${PREVIEW_SITE_PORT:-${running_site_port:-$(free_port 3000)}}"
export PREVIEW_ADMIN_PORT="${PREVIEW_ADMIN_PORT:-${running_admin_port:-$(free_port $((PREVIEW_SITE_PORT + 1)))}}"
export PREVIEW_IDP_PORT="${PREVIEW_IDP_PORT:-${running_idp_port:-$(free_port $((PREVIEW_ADMIN_PORT + 1)))}}"

echo "Starting preview '$PREVIEW_NAME'..."
echo "(the first run builds api, admin and site from source and takes a few minutes)"
docker compose -f "$COMPOSE_FILE" up --build --detach

# The containers need a moment after "up" - migrations, fixtures, application start
if command -v curl >/dev/null; then
    echo -n "Waiting for the site"
    for _ in $(seq 1 150); do
        if curl -fsS -o /dev/null "http://${PREVIEW_HOST}:${PREVIEW_SITE_PORT}/healthcheck/live"; then
            break
        fi
        echo -n "."
        sleep 2
    done
    echo
fi

cat <<EOM

Preview '$PREVIEW_NAME' is up:

  Site   http://${PREVIEW_HOST}:${PREVIEW_SITE_PORT}
  Admin  http://${PREVIEW_HOST}:${PREVIEW_ADMIN_PORT}

  Logs   PREVIEW_NAME=$PREVIEW_NAME docker compose -f $COMPOSE_FILE logs -f
  Stop   PREVIEW_NAME=$PREVIEW_NAME $0 down
EOM
