# Dextinity Starter

In use by `@dextinity/create-app` to create new Dextinity projects. Find more information in the [Dextinity documentation](https://cms-docs.dextinity.com).

<!-- PROJECT_README_BEGIN Everything below this line will go into the Readme of projects created by @dextinity/create-app -->

## Development

### Requirements

- [nvm](https://github.com/nvm-sh/nvm)
- [docker & docker-compose](https://docs.docker.com/compose/)

### Installation

    // Optionally set domain to use instead of localhost (add to ~/.bashrc)
    export DEV_DOMAIN=my-name.dev.vivid-planet.cloud // Vivid Planet network

    // Execute following script
    ./install.sh

### Run Services

    // use correct npm version https://github.com/nvm-sh/nvm#deeper-shell-integration
    nvm use

    // All services
    npm run dev

    npx dev-pm status [--interval]
    npx dev-pm logs <service>
    npx dev-pm restart <service>
    npx dev-pm shutdown

    // import fixtures
    npm run --prefix api fixtures

    // start repl
    npm run --prefix api repl

### Preview Environment

Runs the complete application (api, admin, site and all services) in Docker - prod-like build, no
hot reloading, nothing to install except Docker. Useful for preview environments, e.g. one per
pull request.

    .docker-preview/preview.sh          // start, prints the urls
    .docker-preview/preview.sh down     // stop and delete its data

See [.docker-preview/README.md](.docker-preview/README.md).
