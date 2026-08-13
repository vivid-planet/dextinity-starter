# @dextinity/create-app

This is a command-line interface to create a new Comet application.
It sets up a project with the necessary configuration and files to get started quickly.

## Usage

To create a new Comet app, run the following command:

```bash
npx @dextinity/create-app <project-name>
```

### Arguments

The following arguments can be passed to customize the project setup:

- `project-name` (required): Specifies the name of the project. It will be used as the directory name for the project.
- `--no-install`: Disables the automatic installation of dependencies.
- `--repository <repository>`: Repository to clone from. Defaults to `https://github.com/vivid-planet/dextinity-starter.git`.
- `--branch <branch>`: Branch to checkout. Defaults to `main`.
- `--verbose` or `-v`: Enables extra console logs for verbose output.
- `--version` or `-V`: Outputs the version number.
- `--help` or `-h`: Display help for the command.

#### Example usage with arguments

Create a new Comet app with the name "my-project" and enable verbose logging:

```bash
npx @dextinity/create-app my-project -v
```

Create a new Comet app with a different repository and branch:

```bash
npx @dextinity/create-app my-project -r https://github.com/my-company/dextinity-starter.git -b next
```

### Commands

The following commands can be used to customize the project setup:

- `remove-site`: Removes the site from the project.

Example usage:

```bash
npx @dextinity/create-app remove-site
```

## For developers

### Development

To test the script locally, run the following commands:

1. Start the development process:
    ```bash
    npm start
    ```
2. Run the script:
    ```bash
    node ./bin/index.js
    ```

Testing a close to production usage of the CLI can be done by calling `npm link` in the create-app/ directory. Then `npx @dextinity/create-app` can be used.
