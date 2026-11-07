import { localDomain } from "./local-domain";
import { Environment, GetSiteConfig } from "./site-configs";

const envToDomainMap: Record<Environment, string> = {
    local: localDomain("secondary"),
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
