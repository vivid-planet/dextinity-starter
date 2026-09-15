import { execSync } from "child_process";
import kleur from "kleur";
import { createSpinner } from "nanospinner";
import process from "process";

import { replacePlaceholder } from "../../util/replacePlaceholder";
import { runEslintFix } from "../../util/runEslintFix";
import { amendCommitChanges } from "./amendCommitChanges";
import { cleanupReadme } from "./cleanupReadme";
import { cleanupWorkingDirectory } from "./cleanupWorkingDirectory";
import { createInitialGitCommit } from "./createInitialGitCommit";
import { createWorkingDirectoryCopy } from "./createWorkingDirectoryCopy";

export interface CreateAppCommandOptions {
    projectName: string;
    verbose: boolean;
    install: boolean;
    repository?: string;
    branch?: string;
}

export async function createApp(commandOptions: CreateAppCommandOptions) {
    console.log(`Creating a new Dextinity app in ${kleur.blue(`${process.cwd()}\n`)}`);
    createWorkingDirectoryCopy(commandOptions);
    cleanupReadme(commandOptions.verbose);
    cleanupWorkingDirectory(commandOptions.verbose);
    replacePlaceholder(commandOptions.projectName, commandOptions.verbose);
    createInitialGitCommit(commandOptions.verbose);
    if (commandOptions.install) {
        const spinner = createSpinner("Installing project...").spin();
        try {
            execSync("sh ./install.sh");
            spinner.success();
            if (commandOptions.verbose) {
                console.log(kleur.grey("Successfully installed project."));
            }
            runEslintFix(commandOptions.verbose);
        } catch (error) {
            spinner.error();
            console.log(kleur.yellow("Could not install project."));
            if (commandOptions.verbose) {
                console.log(kleur.grey(`${error}`));
            }
        }
    }
    amendCommitChanges();
    console.log(`\nSuccess! Created '${commandOptions.projectName}' at '${process.cwd()}'.`);
    console.log(`Inside that directory, you can run several commands:\n`);
    console.log(kleur.cyan(`nvm use`));
    console.log(`Switches to the correct Node.js version.\n`);
    if (!commandOptions.install) {
        console.log(kleur.cyan(`sh ./install.sh`));
        console.log(`Installs dependencies.\n`);
    }
    console.log(kleur.cyan(`npm run dev`));
    console.log(`Starts all services.\n`);
    console.log(kleur.cyan(`npx dev-pm status [--interval]`));
    console.log(`Checks the status of services.\n`);
    console.log(kleur.cyan(`npx dev-pm logs <service>`));
    console.log(`Shows the logs of a service.\n`);
    console.log(kleur.cyan(`npx dev-pm restart <service>`));
    console.log(`Restarts a service.\n`);
    console.log(kleur.cyan(`npx dev-pm shutdown`));
    console.log(`Shutdown all services.\n`);
    console.log(kleur.cyan(`npm run --prefix api fixtures`));
    console.log(`Imports fixtures.\n`);
    console.log(kleur.green(`\n☄️ Successfully created Dextinity app: ${commandOptions.projectName}`));
}
