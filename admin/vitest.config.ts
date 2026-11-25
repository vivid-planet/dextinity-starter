import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react-swc";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const currentDirectory = dirname(fileURLToPath(import.meta.url));

// The unit project is written on its own rather than derived from `vite.config.mts`: that config is a function of
// `mode`, injects the environment into the HTML entry and compresses the build, none of which a test run has or needs.
// The one thing repeated from it is the React plugin, because a component styled through `@emotion` renders
// differently without it.
export default defineConfig({
    test: {
        reporters: ["default", "junit"],
        outputFile: { junit: "./junit.xml" },
        projects: [
            {
                plugins: [
                    react({
                        jsxImportSource: "@emotion/react",
                        plugins: [
                            [
                                "@swc/plugin-emotion",
                                {
                                    importMap: {
                                        "@mui/system": {
                                            styled: {
                                                canonicalImport: ["@emotion/styled", "default"],
                                                styledBaseImport: ["@mui/system", "styled"],
                                            },
                                        },
                                        "@mui/material/styles": {
                                            styled: {
                                                canonicalImport: ["@emotion/styled", "default"],
                                                styledBaseImport: ["@mui/material/styles", "styled"],
                                            },
                                        },
                                    },
                                },
                            ],
                        ],
                    }),
                ],
                resolve: {
                    tsconfigPaths: true,
                },
                define: {
                    global: "globalThis",
                },
                test: {
                    name: "unit",
                    environment: "jsdom",
                    setupFiles: ["./src/testing/vitest.setup.ts"],
                    exclude: ["**/node_modules/**", "**/build/**", "**/storybook-static/**"],
                    server: {
                        deps: {
                            // The `@dextinity` packages ship ESM whose relative imports carry no file extension, so Node cannot
                            // load them on its own. They have to go through the Vite resolver the way they do in a build.
                            inline: [/@dextinity\//],
                        },
                    },
                },
            },
            {
                // Like in vite.config.mts: Draft.js reads the Node.js `global`, which the browser doesn't have.
                define: { global: "globalThis" },
                plugins: [storybookTest({ configDir: join(currentDirectory, ".storybook") })],
                optimizeDeps: {
                    rolldownOptions: {
                        // Without it, the pre-bundled emotion JSX runtime resolves React's `jsxDEV` from the production build, where it is undefined.
                        transform: { define: { "process.env.NODE_ENV": JSON.stringify("development") } },
                    },
                },
                test: {
                    name: "storybook",
                    browser: {
                        enabled: true,
                        headless: true,
                        // Chromium's sandbox can't run as root, which is how the CI container executes jobs.
                        provider: playwright({ launchOptions: { args: ["--no-sandbox"] } }),
                        instances: [{ browser: "chromium" }],
                    },
                },
            },
        ],
    },
});
