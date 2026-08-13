import eslintConfigNestJs from "@dextinity/eslint-config/nestjs.js";
import { defineConfig, globalIgnores } from "eslint/config";

const config = defineConfig([
    globalIgnores(["src/db/migrations/**", "dist/**", "src/**/*.generated.ts", "src/**/generated", "block-meta.json", "package-lock.json", "uploads/**"]),
    ...eslintConfigNestJs,
    {
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    paths: [
                        {
                            name: "@faker-js/faker",
                            message: "Import faker from '@src/db/fixtures/faker' instead, which lazily loads @faker-js/faker so it isn't pulled into memory on every API startup.",
                        },
                    ],
                },
            ],
        },
    },
]);

export default config;
