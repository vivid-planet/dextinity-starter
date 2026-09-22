import eslintConfigNestJs from "@dextinity/eslint-config/nestjs.js";
import { defineConfig, globalIgnores } from "eslint/config";

const config = defineConfig([
    globalIgnores(["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "package-lock.json"]),
    ...eslintConfigNestJs,
    {
        // Config files in the package root are dev-only tooling and not part of the TypeScript project,
        // so they can't be parsed by the project service and may import devDependencies.
        files: ["*.mjs", "*.cjs", "*.mts", "*.config.ts", "*.config.js"],
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: null,
                programs: null,
            },
        },
        rules: {
            "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
        },
    },
    {
        rules: {
            "@dextinity/no-other-module-relative-import": "off",
            "package-json/require-exports": "off", // TODO reenable after migrating to ESM
        },
    },
]);

export default config;
