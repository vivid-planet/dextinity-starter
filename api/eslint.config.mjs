import eslintConfigNestJs from "@dextinity/eslint-config/nestjs.js";
import { defineConfig, globalIgnores } from "eslint/config";

const config = defineConfig([
    globalIgnores([
        "src/db/migrations/**",
        "dist/**",
        "src/**/*.generated.ts",
        "src/**/generated",
        "block-meta.json",
        "package-lock.json",
        "uploads/**",
    ]),
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
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@faker-js/faker",
                            message:
                                "Import faker from '@src/db/fixtures/faker' instead, which lazily loads @faker-js/faker so it isn't pulled into memory on every API startup.",
                        },
                    ],
                },
            ],
        },
    },
]);

export default config;
