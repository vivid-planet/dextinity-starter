"use client";
import type { PropsWithData } from "@dextinity/site-nextjs";
import type { HeadingBlockData } from "@src/blocks.generated";
import { PageLayout } from "@src/layout/PageLayout";
import { AnimateBoxInOnScroll } from "@src/util/animations/AnimateBoxInOnScroll";

import styles from "./AnimatedHeadingBlock.module.scss";
import { HeadingBlock } from "./HeadingBlock";

type AnimatedHeadingBlockProps = PropsWithData<HeadingBlockData>;

export const AnimatedHeadingBlock = ({ data }: AnimatedHeadingBlockProps) => (
    <AnimateBoxInOnScroll direction="bottom">
        <HeadingBlock data={data} />
    </AnimateBoxInOnScroll>
);

export const PageContentHeadingBlock = (props: AnimatedHeadingBlockProps) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <AnimatedHeadingBlock {...props} />
        </div>
    </PageLayout>
);
