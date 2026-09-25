import { defineConfig } from "dev-oidc-provider";

import { staticUsers } from "./api/src/auth/static-users";

// Same as ../dev-oidc-provider.config.mts, but with an explicit issuer: inside docker the
// browser reaches the idp under a different address than the one it listens on.
export default defineConfig({
    port: process.env.IDP_PORT ? Number(process.env.IDP_PORT) : 8080,
    issuer: process.env.IDP_SSO_URL,
    userProvider: () => Object.values(staticUsers),
    client: {
        client_id: process.env.IDP_CLIENT_ID,
        client_secret: process.env.IDP_CLIENT_SECRET,
        redirect_uris: [`${process.env.AUTHPROXY_URL}/oauth2/callback`],
        post_logout_redirect_uris: [process.env.POST_LOGOUT_REDIRECT_URI],
    },
});
