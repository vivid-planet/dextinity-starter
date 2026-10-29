// Local domains of the site configs. They are only used by the "local" environment: in development
// the site is served by `npm run dev` under SERVER_HOST:SITE_PORT, in the deploy preview environment
// (see .deploy-preview/docker-compose.yml) by its proxy under the host it was started with.
//
// DEPLOY_PREVIEW_HOST is set by ./start-deploy-preview.sh, everything else uses the development host.
const deployPreviewDomain = process.env.DEPLOY_PREVIEW_HOST;
const devDomain = `${process.env.SERVER_HOST ?? "localhost"}:${process.env.SITE_PORT || "3000"}`;
const baseDomain = deployPreviewDomain || devDomain;

// The main site is served under the base domain itself. In the deploy preview every other site sits
// next to it - <name>--<host> and not <name>.<host> - so that every host stays one dns label deep
// and a single wildcard certificate covers all of them, see .deploy-preview/README.md. In
// development they stay subdomains of localhost, which resolve without any setup.
export const localDomain = (name?: string) => {
    if (!name) {
        return baseDomain;
    }
    return deployPreviewDomain ? `${name}--${baseDomain}` : `${name}.${baseDomain}`;
};
