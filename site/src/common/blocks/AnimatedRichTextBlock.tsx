"use client";
import type { PropsWithData } from "@dextinity/site-nextjs";
import type { RichTextBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { AnimateBoxInOnScroll } from "@src/util/animations/AnimateBoxInOnScroll";

import styles from "./AnimatedRichTextBlock.module.scss";
import { RichTextBlock } from "./RichTextBlock";

type AnimatedRichTextBlockProps = PropsWithData<RichTextBlockData>;

export const AnimatedRichTextBlock = ({ data }: AnimatedRichTextBlockProps) => (
    <AnimateBoxInOnScroll direction="bottom" offset={300}>
        <RichTextBlock data={data} disableLastBottomSpacing />
    </AnimateBoxInOnScroll>
);

export const PageContentRichTextBlock = (props: AnimatedRichTextBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <AnimatedRichTextBlock {...props} />
        </div>
    </PageLayout>
);
