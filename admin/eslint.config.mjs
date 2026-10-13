import eslintConfigReact from "@dextinity/eslint-config/react.js";
import { defineConfig, globalIgnores } from "eslint/config";

const config = defineConfig([
    globalIgnores(["schema.json", "src/fragmentTypes.json", "dist/**", "src/**/*.generated.ts", "src/**/generated/**", "block-meta.json", "**/package-lock.json", "lang/**", "lang-compiled/**", "lang-extracted/**"]),
    ...eslintConfigReact,
]);

export default config;
