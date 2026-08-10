"use client";
import type { PropsWithData } from "@dextinity/site-nextjs";
import type { InternalLinkBlockData } from "@src/blocks.generated";
import Link from "next/link";
import type { AnchorHTMLAttributes, PropsWithChildren } from "react";

interface InternalLinkBlockProps
    extends PropsWithChildren<PropsWithData<InternalLinkBlockData>>, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {}

export function InternalLinkBlock({ data: { targetPage, targetPageAnchor }, children, ...anchorProps }: InternalLinkBlockProps) {
    if (!targetPage) {
        return <span className={anchorProps.className}>{children}</span>;
    }

    let href = targetPageAnchor !== undefined ? `${targetPage.path}#${targetPageAnchor}` : targetPage.path;
    if (targetPage.scope) {
        const language = (targetPage.scope as Record<string, string>).language;
        if (language) {
            href = `/${language}${href}`;
        }
    }

    return (
        <Link {...anchorProps} href={href}>
            {children}
        </Link>
    );
}
