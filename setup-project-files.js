const fs = require("node:fs");
const path = require("node:path");

const files = [
    ...(process.env.CI === "true"
        ? []
        : [
              {
                  file: ".env",
                  targetDir: ["admin", "api", "site"],
              },
              {
                  file: ".env.local",
                  targetDir: ["admin", "api", "site"],
              },
              {
                  file: ".env.secrets",
                  targetDir: ["admin", "api", "site"],
              },
              {
                  file: ".env.site-configs",
                  targetDir: ["admin", "api", "site"],
              },
          ]),
    {
        file: "api/schema.gql",
        targetDir: ["admin", "site"],
    },
    {
        file: "api/block-meta.json",
        targetDir: ["admin", "site"],
    },
    {
        file: "api/src/dextinity-config.json",
        targetDir: ["admin/src", "site/src"],
    },
    {
        file: "site-configs/site-configs.d.ts",
        targetDir: ["admin/src", "api/src", "site/src"],
    },
    {
        file: ".npmrc",
        targetDir: ["admin", "site", "api", "create-app"],
    },
];

for (const { file, targetDir } of files) {
    for (const dir of targetDir) {
        const targetFile = `${dir}/${path.basename(file)}`;
        if (process.env.CI === "true") {
            fs.copyFileSync(file, targetFile);
        } else {
            try {
                fs.unlinkSync(targetFile);
            } catch (e) {
                // Do nothing, if file does not exist
            }
            fs.symlinkSync(path.relative(dir, file), targetFile);
        }
    }
}
