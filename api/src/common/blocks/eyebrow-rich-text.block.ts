import { createTipTapRichTextBlock } from "@dextinity/cms-api";

export const EyebrowRichTextBlock = createTipTapRichTextBlock(
    {
        strike: false,
        orderedList: false,
        unorderedList: false,
        textBlocks: [{ name: "paragraph", tag: "p" }],
        maxTextBlocks: 1,
    },
    "EyebrowRichText",
);
