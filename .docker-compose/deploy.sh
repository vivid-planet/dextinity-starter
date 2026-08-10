#!/bin/bash
set -e

. ~/.nvm/nvm.sh

echo "Starting deployment process..."

echo "Pulling latest changes from the repository..."
git pull

echo "Installing root dependencies..."
nvm use 24
npm ci

echo "Injecting site configs..."
sed -i 's/dev\.comet\-dxp\.com/docker.comet-dxp.com/g' site-configs/main.ts # TODO: Remove me in real project
APP_ENV=dev npx -y @dextinity/cli inject-site-configs -f site-configs/site-configs.ts -i .docker-compose/docker-compose.tpl.yml -o .docker-compose/docker-compose.yml --base64

echo "Building and starting the Docker containers..."
docker compose -f .docker-compose/docker-compose.yml up --build -d

echo "Watch logs with: \"docker compose -f .docker-compose/docker-compose.yml logs -f\""
