import { createTipTapRichTextBlock } from "@dextinity/cms-admin";
import { FormattedMessage } from "react-intl";

export const EyebrowRichTextBlock = {
    ...createTipTapRichTextBlock({
        strike: false,
        orderedList: false,
        unorderedList: false,
        textBlocks: [{ name: "paragraph", label: <FormattedMessage id="eyebrowRichTextBlock.paragraph" defaultMessage="Paragraph" />, tag: "p" }],
        maxTextBlocks: 1,
        minHeight: 0,
    }),
    name: "EyebrowRichText",
};
