import { createTipTapRichTextBlock, type TipTapTextBlock, type TipTapTextBlockStyle } from "@dextinity/cms-admin";
import { Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

const sizeStyles: TipTapTextBlockStyle[] = [
    {
        name: "size600",
        label: <FormattedMessage id="headlineRichTextBlock.size600" defaultMessage="Size 600" />,
        element: (props, tag) => <Typography component={tag} variant="h1" {...props} />,
    },
    {
        name: "size550",
        label: <FormattedMessage id="headlineRichTextBlock.size550" defaultMessage="Size 550" />,
        element: (props, tag) => <Typography component={tag} variant="h2" {...props} />,
    },
    {
        name: "size500",
        label: <FormattedMessage id="headlineRichTextBlock.size500" defaultMessage="Size 500" />,
        element: (props, tag) => <Typography component={tag} variant="h3" {...props} />,
    },
    {
        name: "size450",
        label: <FormattedMessage id="headlineRichTextBlock.size450" defaultMessage="Size 450" />,
        element: (props, tag) => <Typography component={tag} variant="h4" {...props} />,
    },
    {
        name: "size400",
        label: <FormattedMessage id="headlineRichTextBlock.size400" defaultMessage="Size 400" />,
        element: (props, tag) => <Typography component={tag} variant="h5" {...props} />,
    },
    {
        name: "size350",
        label: <FormattedMessage id="headlineRichTextBlock.size350" defaultMessage="Size 350" />,
        element: (props, tag) => <Typography component={tag} variant="h6" {...props} />,
    },
];

const headingTextBlocks: Array<Pick<TipTapTextBlock, "name" | "label" | "tag">> = [
    { name: "heading-1", label: <FormattedMessage id="headlineRichTextBlock.heading1" defaultMessage="Headline 1" />, tag: "h1" },
    { name: "heading-2", label: <FormattedMessage id="headlineRichTextBlock.heading2" defaultMessage="Headline 2" />, tag: "h2" },
    { name: "heading-3", label: <FormattedMessage id="headlineRichTextBlock.heading3" defaultMessage="Headline 3" />, tag: "h3" },
    { name: "heading-4", label: <FormattedMessage id="headlineRichTextBlock.heading4" defaultMessage="Headline 4" />, tag: "h4" },
    { name: "heading-5", label: <FormattedMessage id="headlineRichTextBlock.heading5" defaultMessage="Headline 5" />, tag: "h5" },
    { name: "heading-6", label: <FormattedMessage id="headlineRichTextBlock.heading6" defaultMessage="Headline 6" />, tag: "h6" },
];

const textBlocks: TipTapTextBlock[] = headingTextBlocks.map((textBlock) => ({ ...textBlock, styles: sizeStyles, defaultStyle: "size600" }));

export const HeadlineRichTextBlock = {
    ...createTipTapRichTextBlock({
        undoRedoButtons: false,
        strike: false,
        orderedList: false,
        unorderedList: false,
        textBlocks,
        defaultTextBlock: "heading-2",
        maxTextBlocks: 1,
        minHeight: 0,
    }),
    name: "HeadlineRichText",
};
