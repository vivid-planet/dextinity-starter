#!/bin/sh
# Prepares the database and starts the api.
set -e

if [ "$LOAD_FIXTURES" = "true" ] && [ ! -f uploads/.fixtures-loaded ]; then
    # "fixtures" drops all tables, runs the migrations and creates demo content.
    # Only done once per instance, so that content created in the preview survives a restart.
    echo "Loading fixtures (first start of this instance)..."
    node dist/console.js fixtures
    touch uploads/.fixtures-loaded
else
    node dist/console.js migrate
fi

exec node dist/main
