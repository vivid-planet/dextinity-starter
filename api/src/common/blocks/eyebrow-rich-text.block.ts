import { createTipTapRichTextBlock } from "@dextinity/cms-api";

// The Draft.js editor offered only inline styles, but content created through the API or the fixtures uses these types
const draftJsTypes = [
    "unstyled",
    "paragraph-standard",
    "paragraph-small",
    "header-one",
    "header-two",
    "header-three",
    "header-four",
    "header-five",
    "header-six",
];

export const EyebrowRichTextBlock = createTipTapRichTextBlock(
    {
        strike: false,
        orderedList: false,
        unorderedList: false,
        textBlocks: [{ name: "paragraph", tag: "p" }],
        maxTextBlocks: 1,
        migrateFromDraftJs: {
            textBlockMap: Object.fromEntries(draftJsTypes.map((type) => [type, { textBlock: "paragraph" }])),
        },
    },
    "EyebrowRichText",
);
