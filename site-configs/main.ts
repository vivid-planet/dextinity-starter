import { localDomain } from "./local-domain";
import { Environment, GetSiteConfig } from "./site-configs";

const envToDomainMap: Record<Environment, string> = {
    local: localDomain(),
    dev: "dev.dextinity.com",
    test: "test.dextinity.com",
    staging: "staging.dextinity.com",
    prod: "dextinity.com",
};

export default ((env) => {
    return {
        name: "Starter Main",
        domains: {
            main: envToDomainMap[env],
            preliminary: env === "prod" ? "preliminary.dextinity.com" : undefined, // preliminary domain activates prelogin automatically
        },
        preloginEnabled: env !== "local" && env !== "prod",
        preloginPassword: undefined,
        public: {
            scope: {
                domain: "main",
                languages: ["en", "de"],
            },
            gtmId: "GTM-XXXX",
            organization: {
                name: "Vivid Planet Software GmbH",
                url: "https://www.vivid-planet.com",
                logo: "/assets/dextinity-logo.svg",
                sameAs: ["https://github.com/vivid-planet"],
                description: "Vivid Planet Software GmbH develops Dextinity CMS, the open-source content management system.",
            },
        },
    };
}) satisfies GetSiteConfig;
