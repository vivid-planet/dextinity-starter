import eslintConfigNextJs from "@dextinity/eslint-config/nextjs.js";
import { defineConfig, globalIgnores } from "eslint/config";
import storybook from "eslint-plugin-storybook";

const docsLink = "https://cms-docs.dextinity.com/docs/faqs/environment-variables-in-site";

const config = defineConfig([
    globalIgnores([
        "**/**/*.generated.ts",
        "lang/**",
        "lang-compiled/**",
        "lang-extracted/**",
        ".next/**",
        "public/**",
        "storybook-static/**",
        "block-meta.json",
        "package-lock.json",
    ]),
    ...eslintConfigNextJs,
    ...storybook.configs["flat/recommended"],
    {
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector:
                        "MemberExpression[object.type='MemberExpression'][object.object.name='process'][object.property.name='env'][property.name=/^NEXT_PUBLIC_/]",
                    message: `Usage of process.env.NEXT_PUBLIC_* is not allowed. Use site configs or a custom provider instead. See ${docsLink}`,
                },
            ],
        },
    },
    {
        files: [".storybook/**/*.{ts,tsx}", "vitest.config.ts"],
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: ["./tsconfig.storybook.json"],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["next.config.*"],
        languageOptions: {
            parserOptions: {
                projectService: false,
                project: null,
                programs: null,
            },
        },
        rules: {
            "no-restricted-syntax": [
                "error",
                {
                    selector: "MemberExpression[object.type='MemberExpression'][object.object.name='process'][object.property.name='env']",
                    message: `Usage of process.env in next.config is not allowed. Use site configs or runtime configuration instead. See ${docsLink}`,
                },
            ],
        },
    },
]);

export default config;
