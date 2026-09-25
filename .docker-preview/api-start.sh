#!/bin/sh
# Brings the database up to date and starts the api.
set -e

# The fixtures command drops all tables, so it must only run once per database.
# The marker lives in the uploads volume, which has the same lifetime as the database volume.
FIXTURES_MARKER="uploads/.fixtures-loaded"

if [ "${PREVIEW_LOAD_FIXTURES:-0}" = "1" ] && [ ! -f "$FIXTURES_MARKER" ]; then
    node dist/console.js fixtures
    touch "$FIXTURES_MARKER"
else
    node dist/console.js migrate
fi

node dist/console.js createBlockIndexViews

exec node dist/main
