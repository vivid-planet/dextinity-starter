"use client";
import { type PropsWithData, withPreview } from "@dextinity/site-nextjs";
import type { CallToActionBlockData } from "@src/blocks.generated";
import { LinkBlock } from "@src/common/blocks/LinkBlock";

import { Button, type ButtonVariant } from "../components/Button";
import { HiddenIfInvalidLink } from "../helpers/HiddenIfInvalidLink";

const buttonVariantMap: Record<CallToActionBlockData["variant"], ButtonVariant> = {
    contained: "contained",
    outlined: "outlined",
    text: "text",
};

export const CallToActionBlock = withPreview(
    ({ data: { textLink, variant } }: PropsWithData<CallToActionBlockData>) => (
        <HiddenIfInvalidLink link={textLink.link}>
            <Button as={LinkBlock} data={textLink.link} variant={buttonVariantMap[variant]}>
                {textLink.text}
            </Button>
        </HiddenIfInvalidLink>
    ),
    { label: "Call To Action" },
);
