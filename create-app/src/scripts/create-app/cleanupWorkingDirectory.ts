import * as fs from "fs";
import * as path from "path";

import { deleteFilesAndFolders } from "../../util/deleteFilesAndFolders";
import { removeReferenceInFile } from "../../util/removeReferenceInFile";

const githubFilesToKeep = [".github/pull_request_template.md", ".github/workflows/auto-assign.yml", ".github/auto_assign.yml"];

export function cleanupWorkingDirectory(verbose: boolean) {
    deleteFilesAndFolders(
        [
            "create-app",
            ".git",
            "LICENSE",
            ".digitalocean",
            "renovate.json",
            "sonar-project.properties",
            ".docker-compose",
            ...getGithubFilesToDelete(".github"),
        ],
        verbose,
    );
    removeReferenceInFile("lint-staged.config.js", /.*create-app.*\n/gim, verbose);
    removeReferenceInFile(".vscode/settings.json", /, "create-app"/g, verbose);
    removeReferenceInFile("install.sh", /^.*create-app.*$/gm, verbose);
    removeReferenceInFile("setup-project-files.js", /, "create-app"/g, verbose);
    removeReferenceInFile("package.json", /create-app,/g, verbose);
    removeReferenceInFile("package.json", /.*"lint:create-app".*\n/g, verbose);
    removeReferenceInFile("package.json", /\|create-app/g, verbose);
}

function getGithubFilesToDelete(directory: string): string[] {
    if (!fs.existsSync(directory)) {
        return [];
    }

    return fs.readdirSync(directory).flatMap((entry) => {
        const entryPath = path.posix.join(directory, entry);
        if (githubFilesToKeep.some((fileToKeep) => fileToKeep.startsWith(`${entryPath}/`))) {
            return getGithubFilesToDelete(entryPath);
        }
        return githubFilesToKeep.includes(entryPath) ? [] : [entryPath];
    });
}
