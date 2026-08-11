import type { BaseSiteConfig, ExtractPrivateSiteConfig, ExtractPublicSiteConfig } from "@dextinity/cli";

export type ContentScope = {
    domain: string;
    language: string;
};

export interface SiteConfig extends BaseSiteConfig {
    preloginPassword?: string;
    public: {
        scope: {
            domain: string;
            languages: string[];
        };
        gtmId?: string;
    };
}

export type PrivateSiteConfig = ExtractPrivateSiteConfig<SiteConfig>;
export type PublicSiteConfig = ExtractPublicSiteConfig<SiteConfig>;
