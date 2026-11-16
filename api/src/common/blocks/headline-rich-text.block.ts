import { createTipTapRichTextBlock, type TipTapTextBlock } from "@dextinity/cms-api";

const headlineTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

const sizeByDraftJsType: Record<string, string> = {
    "header-one": "size600",
    "header-two": "size550",
    "header-three": "size500",
    "header-four": "size450",
    "header-five": "size400",
    "header-six": "size350",
};

const sizes = Object.values(sizeByDraftJsType);

// The Draft.js editor didn't offer these types, but content created through the API may use them
const draftJsTypesWithoutSize = ["unstyled", "paragraph-standard", "paragraph-small"];

const textBlocks: TipTapTextBlock[] = headlineTags.map((tag) => ({
    name: `heading-${tag.slice(1)}`,
    tag,
    styles: sizes.map((name) => ({ name })),
    defaultStyle: "size600",
}));

export const defaultHeadlineTag = "h2";

/**
 * The Draft.js headline stored only the size; its tag was a separate field of the heading block. The heading block's migration
 * writes both into the Draft.js type, so the conversion to TipTap can map them to a text block and a style.
 */
export function getDraftJsTypeWithHeadlineTag(draftJsType: string, tag: string): string {
    return `${tag}:${draftJsType}`;
}

const draftJsTextBlockMap = Object.fromEntries(
    textBlocks.flatMap(({ name, tag }) => [
        ...Object.entries(sizeByDraftJsType).map(([draftJsType, size]) => [
            getDraftJsTypeWithHeadlineTag(draftJsType, tag),
            { textBlock: name, textBlockStyle: size },
        ]),
        ...draftJsTypesWithoutSize.map((draftJsType) => [
            getDraftJsTypeWithHeadlineTag(draftJsType, tag),
            { textBlock: name, textBlockStyle: "size600" },
        ]),
    ]),
);

export const HeadlineRichTextBlock = createTipTapRichTextBlock(
    {
        strike: false,
        orderedList: false,
        unorderedList: false,
        textBlocks,
        defaultTextBlock: `heading-${defaultHeadlineTag.slice(1)}`,
        maxTextBlocks: 1,
        migrateFromDraftJs: { textBlockMap: draftJsTextBlockMap },
    },
    "HeadlineRichText",
);
