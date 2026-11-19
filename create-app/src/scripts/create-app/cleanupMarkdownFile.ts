import * as fs from "fs";
import kleur from "kleur";

export function cleanupMarkdownFile(filePath: string, verbose: boolean) {
    try {
        const originalContent = fs.readFileSync(filePath, "utf8").toString();
        const newContent = originalContent.replace(/.+<!-- PROJECT_[A-Z]+_BEGIN.+?-->\n\n/s, "");
        fs.writeFileSync(filePath, newContent, "utf8");
        if (verbose) {
            console.log(kleur.grey(`Cleaned up ${filePath}`));
        }
    } catch (e) {
        console.log(kleur.yellow(`Could not clean up ${filePath}`));
        if (verbose) {
            console.log(kleur.grey(`${e}`));
        }
    }
}
