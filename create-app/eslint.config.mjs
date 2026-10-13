import eslintConfigNestJs from "@dextinity/eslint-config/nestjs.js";
import { defineConfig, globalIgnores } from "eslint/config";

const config = defineConfig([
    globalIgnores(["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "package-lock.json"]),
    ...eslintConfigNestJs,
    {
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
            "package-json/require-exports": "off", // TODO reenable after migrating to ESM
        },
    },
]);

export default config;
