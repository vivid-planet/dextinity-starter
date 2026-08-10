import fs from "fs";

export function cwdIsCometProject(): boolean {
    return fs.existsSync("api/src/dextinity-config.json");
}
