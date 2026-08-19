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

### Debugging

This project provides a VSCode launch configuration for debugging the API and Admin. To use them, follow these steps:

#### API

1. Stop the API service: `npx dev-pm stop api`.
2. Go to the “Run and Debug” section in the VSCode UI.
3. Select and start the “Debug API” configuration.

#### Admin

1. Stop the Admin service: `npx dev-pm stop admin`.
2. Go to the “Run and Debug” section in the VSCode UI.
3. Select and start the “Debug Admin” configuration. This is a compound launch configuration. It starts two configurations simultaneously: “Start Admin Service” and “Launch Chrome.”
4. A new Chrome window will be launched. It is normal that you see "This site can’t be reached."
5. Reload the new Chrome window when the "Start Admin Service" launch configuration is ready.

If you prefer using Firefox, a launch configuration for it is also provided in this repository. Just click "Launch Firefox" to do so (after having started the configuration "Debug Admin or Start Admin Service").
