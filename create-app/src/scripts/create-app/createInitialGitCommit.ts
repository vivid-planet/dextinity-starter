import { execSync } from "child_process";
import kleur from "kleur";

export function createInitialGitCommit(verbose: boolean) {
    try {
        execSync("git init");
        execSync("git add . -f");
        const basedOnCommit = execSync('git ls-remote https://github.com/vivid-planet/dextinity-starter.git | head -1 | sed "s/HEAD//"');
        execSync("git checkout -b setup-project");
        execSync(`git commit -m "Initial commit from Starter" -m "Based on ${basedOnCommit}"`);
        if (verbose) {
            console.log(kleur.grey("Created initial git commit."));
        }
    } catch (e) {
        console.log(kleur.yellow("Could not create git commit."));
        if (verbose) {
            console.log(kleur.grey(`${e}`));
        }
    }
}
