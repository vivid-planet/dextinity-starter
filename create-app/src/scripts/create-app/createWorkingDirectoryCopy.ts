import { execSync } from "child_process";
import kleur from "kleur";
import process from "process";

import type { CreateAppCommandOptions } from "./createApp";

export function createWorkingDirectoryCopy({
    projectName,
    repository = "https://github.com/vivid-planet/dextinity-starter.git",
    branch = "main",
    verbose,
}: Pick<CreateAppCommandOptions, "projectName" | "repository" | "branch" | "verbose">): void {
    try {
        const clone = `git clone --depth 1 --branch ${branch} ${repository} ./${projectName}`;
        execSync(clone);
        process.chdir(`./${projectName}`);
        if (verbose) {
            console.log(kleur.grey("Cloned git repository."));
        }
    } catch (e) {
        console.log(kleur.red("Could not clone git repository."));
        if (verbose) {
            console.log(kleur.grey(`${e}`));
        }
        process.exit(1);
    }
}
