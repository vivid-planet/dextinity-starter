import fs from "fs";

export function cwdIsDextinityProject(): boolean {
    return fs.existsSync("api/src/dextinity-config.json");
}
