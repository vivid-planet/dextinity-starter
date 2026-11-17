#!/bin/sh
set -e

# The fixtures command drops all tables, so it must only run once per database.
# The marker lives in the uploads volume, which has the same lifetime as the database volume.
FIXTURES_MARKER="uploads/.fixtures-loaded"

if [ ! -f "$FIXTURES_MARKER" ]; then
    node --import ./dist/tracing.js dist/console.js fixtures
    touch "$FIXTURES_MARKER"
else
    node --import ./dist/tracing.js dist/console.js migrate
fi

node --import ./dist/tracing.js dist/console.js createBlockIndexViews

exec node --import ./dist/tracing.js dist/main.js
