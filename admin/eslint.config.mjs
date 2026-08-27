import eslintConfigReact from "@dextinity/eslint-config/react.js";
import { defineConfig, globalIgnores } from "eslint/config";

const config = defineConfig([
    globalIgnores([
        "schema.json",
        "src/fragmentTypes.json",
        "dist/**",
        "src/**/*.generated.ts",
        "src/**/generated/**",
        "block-meta.json",
        "**/package-lock.json",
        "lang/**",
        "lang-compiled/**",
        "lang-extracted/**",
    ]),
    ...eslintConfigReact,
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
]);

export default config;
