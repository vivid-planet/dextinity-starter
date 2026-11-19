import { createTipTapRichTextBlock, type TipTapTextBlock } from "@dextinity/cms-api";
import { LinkBlock } from "@src/common/blocks/link.block";

const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const textBlocks: TipTapTextBlock[] = [
    { name: "paragraph", tag: "p", styles: [{ name: "standard" }, { name: "small" }], defaultStyle: "standard" },
    ...headingTags.map((tag) => ({ name: `heading-${tag.slice(1)}`, tag })),
];

export const RichTextBlock = createTipTapRichTextBlock({ link: LinkBlock, textBlocks, listLevelMax: 4, textAlign: true }, "RichText");
