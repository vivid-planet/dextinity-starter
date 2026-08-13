import { previewParams } from "@dextinity/site-nextjs/server";
import { getHostByHeaders, getSiteConfigForHost } from "@src/util/siteConfig";
import { type NextRequest, NextResponse } from "next/server";

import type { CustomMiddleware } from "./chain";

export type VisibilityParam = "default" | "invisiblePages" | "invisibleBlocks";

/**
 * Rewrite request to include the matching domain (from http host) in the path, so the route can have [domain] as parameter.
 *
 * Doing this matching in the middleware makes it possible to keep static rendering, as the page doesn't need headers() to get the domain.
 */
export function withDomainRewriteMiddleware(middleware: CustomMiddleware) {
    return async (request: NextRequest) => {
        const headers = request.headers;
        const host = getHostByHeaders(headers);
        const siteConfig = await getSiteConfigForHost(host);
        if (!siteConfig) {
            throw new Error(`Cannot get siteConfig for host ${host}`);
        }

        const preview = await previewParams({ skipDraftModeCheck: true });
        let visibilityParam: VisibilityParam = "default";
        if (preview?.previewData) {
            visibilityParam = preview.previewData.includeInvisible ? "invisibleBlocks" : "invisiblePages";
        }

        return NextResponse.rewrite(
            new URL(
                `/${visibilityParam}/${siteConfig.scope.domain}${request.nextUrl.pathname}${
                    request.nextUrl.searchParams.toString().length > 0 ? `?${request.nextUrl.searchParams.toString()}` : ""
                }`,
                request.url,
            ),
            { request: { headers } },
        );
    };
}
