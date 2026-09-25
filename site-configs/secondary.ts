import { Environment, GetSiteConfig } from "./site-configs";

const host = process.env.SERVER_HOST ?? "localhost";
const port = parseInt(process.env.SITE_PORT || "3000", 10);
// The docker preview environment (see docker-compose.preview.yml) uses the "local" environment,
// but serves the site under its own domain.
const localDomain = process.env.SITE_DOMAIN ?? `${host}:${port}`;

const envToDomainMap: Record<Environment, string> = {
    local: `secondary.${localDomain}`,
    dev: "dev-secondary.dextinity.com",
    test: "test-secondary.dextinity.com",
    staging: "staging-secondary.dextinity.com",
    prod: "secondary.dextinity.com",
};

export default ((env) => {
    return {
        name: "Starter Secondary",
        domains: {
            main: envToDomainMap[env],
        },
        preloginEnabled: env !== "local" && env !== "prod",
        preloginPassword: undefined,
        public: {
            scope: {
                domain: "secondary",
                languages: ["en", "de"],
            },
            gtmId: "GTM-YYYY",
            organization: {
                name: "Starter Secondary",
            },
        },
    };
}) satisfies GetSiteConfig;
