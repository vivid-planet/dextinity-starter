#!/bin/bash

# TODO move me to project root and change app ids if in use

doctl apps update <imgproxy-app-id> --spec .digitalocean/comet-starter-imgproxy.yaml

sed -i '' 's/dev\.comet\-dxp\.com/digitalocean.comet-dxp.com/g' site-configs/main.ts

APP_ENV=dev npx -y @dextinity/cli inject-site-configs -f site-configs/site-configs.ts -i .digitalocean/comet-starter-cms.tpl.yaml -o .digitalocean/comet-starter-cms.yaml --base64
doctl apps update <cms-app-id> --spec .digitalocean/comet-starter-cms.yaml # configuration changes
doctl apps create-deployment xxxx # code changes

APP_ENV=dev npx -y @dextinity/cli inject-site-configs -f site-configs/site-configs.ts -i .digitalocean/comet-starter-site-main.tpl.yaml -o .digitalocean/comet-starter-site-main.yaml --base64
doctl apps update <site-main-app-id> --spec .digitalocean/comet-starter-site-main.yaml # configuration changes
doctl apps create-deployment yyyy # code changes
