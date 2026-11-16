import { createTipTapRichTextBlock, type TipTapTextBlock } from "@dextinity/cms-api";

const headlineTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const sizes = ["size600", "size550", "size500", "size450", "size400", "size350"];

const textBlocks: TipTapTextBlock[] = headlineTags.map((tag) => ({
    name: `heading-${tag.slice(1)}`,
    tag,
    styles: sizes.map((name) => ({ name })),
    defaultStyle: "size600",
}));

export const HeadlineRichTextBlock = createTipTapRichTextBlock(
    {
        strike: false,
        orderedList: false,
        unorderedList: false,
        textBlocks,
        defaultTextBlock: "heading-2",
        maxTextBlocks: 1,
    },
    "HeadlineRichText",
);
