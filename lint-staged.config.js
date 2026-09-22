module.exports = {
    "admin/src/**/*.{ts,tsx,js,jsx,json,css,md}": () => ["npm --prefix admin run lint:eslint", "npm --prefix admin run lint:knip"],
    "admin/**/*.{ts,tsx}": () => ["npm --prefix admin run lint:tsc", "npm --prefix admin run intl:extract"],
    "admin/*.{ts,mts,js,mjs,cjs,json,md,yml,yaml}": () => ["npm --prefix admin run lint:prettier", "npm --prefix admin run lint:eslint"],
    "api/src/**/*.{ts,tsx,js,jsx,json,css,md}": () => ["npm --prefix api run lint:eslint", "npm --prefix api run lint:knip"],
    "api/**/*.{ts,tsx}": () => "npm --prefix api run lint:tsc",
    "api/*.{ts,mts,js,mjs,cjs,json,md,yml,yaml}": () => ["npm --prefix api run lint:prettier", "npm --prefix api run lint:eslint"],
    "site/src/**/*.{ts,tsx,js,jsx,json,css,md}": () => ["npm --prefix site run lint:eslint", "npm --prefix site run lint:knip"],
    "site/**/*.{ts,tsx}": () => ["npm --prefix site run lint:tsc", "npm --prefix site run intl:extract"],
    "site/*.{ts,mts,js,mjs,cjs,json,md,yml,yaml}": () => ["npm --prefix site run lint:prettier", "npm --prefix site run lint:eslint"],
    "site/src/**/*.{css,scss}": () => "npm --prefix site run lint:style",
    "create-app/src/**/*.{ts,tsx,js,jsx,json,css,scss,md}": () => "npm --prefix create-app run lint:eslint",
    "create-app/**/*.{ts,tsx}": () => "npm --prefix create-app run lint:tsc",
    "create-app/*.{ts,mts,js,mjs,cjs,json,md,yml,yaml}": () => [
        "npm --prefix create-app run lint:prettier",
        "npm --prefix create-app run lint:eslint",
    ],
    "./**/*.{ts,mts,js,mjs,cjs,json,md,yml,yaml}": () => "npm run lint:root",
};
