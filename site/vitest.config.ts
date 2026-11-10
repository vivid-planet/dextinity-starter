import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    test: {
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        projects: [
            {
                resolve: { tsconfigPaths: true },
                test: {
                    name: "unit",
                    environment: "jsdom",
                    exclude: [".next/**", "dist/**", "node_modules/**", "storybook-static/**"],
                },
            },
            {
                plugins: [storybookTest({ configDir: join(currentDirectory, ".storybook") })],
                test: {
                    name: "storybook",
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({ launchOptions: { args: ["--no-sandbox"] } }),
                        instances: [{ browser: "chromium" }],
                    },
                },
            },
        ],
    },
});
