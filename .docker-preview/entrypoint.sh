#!/bin/sh
# Shared entrypoint for api, admin and site.
#
# PUBLIC_SITE_CONFIGS/PRIVATE_SITE_CONFIGS contain the host and the port of this preview
# instance, so they can't be baked into the images. They are generated once per "docker
# compose up" by the "site-configs" service and shared through a volume.
set -e

if [ -f /site-configs/.env.site-configs ]; then
    set -a
    . /site-configs/.env.site-configs
    set +a
fi

exec "$@"
