"use client";
import { type PropsWithData, withPreview } from "@dextinity/site-nextjs";
import type { StandaloneMediaBlockData } from "@src/blocks.generated";
import { MediaBlock } from "@src/common/blocks/MediaBlock";
import { PageLayout } from "@src/layout/PageLayout";
import { AnimateBoxInOnScroll } from "@src/util/animations/AnimateBoxInOnScroll";

export const StandaloneMediaBlock = withPreview(
    ({ data: { media, aspectRatio } }: PropsWithData<StandaloneMediaBlockData>) => {
        return (
            <PageLayout>
                <AnimateBoxInOnScroll direction="bottom">
                    <MediaBlock data={media} aspectRatio={aspectRatio} />
                </AnimateBoxInOnScroll>
            </PageLayout>
        );
    },
    { label: "Media" },
);
