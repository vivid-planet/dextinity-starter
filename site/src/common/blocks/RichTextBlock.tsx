"use client";
import {
    hasTipTapRichTextContent,
    PreviewSkeleton,
    type PropsWithData,
    renderTipTapRichText,
    type TipTapMarkHandler,
    type TipTapNodeHandler,
    withPreview,
} from "@dextinity/site-nextjs";
import type { LinkBlockData, RichTextBlockData } from "@src/blocks.generated";
import { Typography, type TypographyProps } from "@src/common/components/Typography";
import { isValidLink } from "@src/common/helpers/HiddenIfInvalidLink";
import { PageLayout } from "@src/layout/PageLayout";
import { AnimateBoxInOnScroll } from "@src/util/animations/AnimateBoxInOnScroll";

import { LinkBlock } from "./LinkBlock";
import styles from "./RichTextBlock.module.scss";
import { textAlignClassName } from "./textAlignClassName";

const typographyPropsByTextBlock: Record<string, TypographyProps<keyof HTMLElementTagNameMap>> = {
    paragraph: { as: "p" },
    "heading-1": { as: "h1", variant: "headline600" },
    "heading-2": { as: "h2", variant: "headline550" },
    "heading-3": { as: "h3", variant: "headline500" },
    "heading-4": { as: "h4", variant: "headline450" },
    "heading-5": { as: "h5", variant: "headline400" },
    "heading-6": { as: "h6", variant: "headline350" },
};

const nodeMapping: Record<string, TipTapNodeHandler> = {
    textBlock: ({ node, parent, children }) => {
        if (parent?.type === "listItem") {
            return <span className={textAlignClassName(node.attrs?.textAlign, styles.listItemText)}>{children}</span>;
        }
        const typographyProps = typographyPropsByTextBlock[node.attrs?.textBlock as string] ?? typographyPropsByTextBlock.paragraph;
        const variant = node.attrs?.textBlockStyle === "small" ? "paragraph200" : typographyProps.variant;
        return (
            <Typography {...typographyProps} variant={variant} bottomSpacing className={textAlignClassName(node.attrs?.textAlign, styles.text)}>
                {children}
            </Typography>
        );
    },
    bulletList: ({ children }) => <ul>{children}</ul>,
    orderedList: ({ children }) => <ol className={styles.orderedList}>{children}</ol>,
    listItem: ({ children }) => (
        <Typography as="li" className={styles.text}>
            {children}
        </Typography>
    ),
};

const markMapping: Record<string, TipTapMarkHandler> = {
    link: ({ mark, children }) => {
        const data = mark.attrs?.data as LinkBlockData;
        return isValidLink(data) ? (
            <LinkBlock data={data} className={styles.inlineLink}>
                {children}
            </LinkBlock>
        ) : (
            <span>{children}</span>
        );
    },
};

interface RichTextBlockProps extends PropsWithData<RichTextBlockData> {
    disableLastBottomSpacing?: boolean;
}

export const RichTextBlock = withPreview(
    ({ data, disableLastBottomSpacing }: RichTextBlockProps) => {
        const rendered = renderTipTapRichText({ content: data.tipTapContent, nodeMapping, markMapping });

        return (
            <PreviewSkeleton title="RichText" type="rows" hasContent={hasTipTapRichTextContent(data.tipTapContent)}>
                {disableLastBottomSpacing ? <div className={styles.disableLastBottomSpacing}>{rendered}</div> : rendered}
            </PreviewSkeleton>
        );
    },
    { label: "Rich Text" },
);

export const PageContentRichTextBlock = ({ data }: PropsWithData<RichTextBlockData>) => (
    <PageLayout grid>
        <div className={styles.pageLayoutContent}>
            <AnimateBoxInOnScroll direction="bottom" offset={300}>
                <RichTextBlock data={data} disableLastBottomSpacing />
            </AnimateBoxInOnScroll>
        </div>
    </PageLayout>
);
