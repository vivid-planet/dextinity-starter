import fs from "fs";

export function cwdIsDextinityProject(): boolean {
    return fs.existsSync("api/src/comet-config.json");
}
