import { createTipTapRichTextBlock, type TipTapTextBlock, type TipTapTextBlockElement } from "@dextinity/cms-admin";
import { type SxProps, Typography } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { LinkBlock } from "./LinkBlock";

// Spacing and font weights of the Draft.js editor this editor replaced
const headingSx: SxProps = { fontWeight: 500, lineHeight: 1.2, marginBottom: "10px" };

const listItemSx: SxProps = { fontSize: 16, lineHeight: "20px", fontWeight: 300 };

const paragraphSx: SxProps = { ...listItemSx, marginBottom: "10px" };

const smallParagraphSx: SxProps = { marginBottom: "10px" };

const createHeadingElement =
    (variant: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"): TipTapTextBlockElement =>
    (props, tag) => <Typography component={tag} variant={variant} sx={headingSx} {...props} />;

const textBlocks: TipTapTextBlock[] = [
    {
        name: "paragraph",
        label: <FormattedMessage id="richTextBlock.paragraph" defaultMessage="Paragraph" />,
        tag: "p",
        styles: [
            {
                name: "standard",
                label: <FormattedMessage id="richTextBlock.standard" defaultMessage="Standard" />,
                element: (props, tag) => <Typography component={tag} sx={paragraphSx} {...props} />,
            },
            {
                name: "small",
                label: <FormattedMessage id="richTextBlock.small" defaultMessage="Small" />,
                element: (props, tag) => <Typography component={tag} variant="body2" sx={smallParagraphSx} {...props} />,
            },
        ],
        defaultStyle: "standard",
    },
    {
        name: "heading-1",
        label: <FormattedMessage id="richTextBlock.heading1" defaultMessage="Heading 1" />,
        tag: "h1",
        element: createHeadingElement("h1"),
    },
    {
        name: "heading-2",
        label: <FormattedMessage id="richTextBlock.heading2" defaultMessage="Heading 2" />,
        tag: "h2",
        element: createHeadingElement("h2"),
    },
    {
        name: "heading-3",
        label: <FormattedMessage id="richTextBlock.heading3" defaultMessage="Heading 3" />,
        tag: "h3",
        element: createHeadingElement("h3"),
    },
    {
        name: "heading-4",
        label: <FormattedMessage id="richTextBlock.heading4" defaultMessage="Heading 4" />,
        tag: "h4",
        element: createHeadingElement("h4"),
    },
    {
        name: "heading-5",
        label: <FormattedMessage id="richTextBlock.heading5" defaultMessage="Heading 5" />,
        tag: "h5",
        element: createHeadingElement("h5"),
    },
    {
        name: "heading-6",
        label: <FormattedMessage id="richTextBlock.heading6" defaultMessage="Heading 6" />,
        tag: "h6",
        element: createHeadingElement("h6"),
    },
];

export const RichTextBlock = {
    ...createTipTapRichTextBlock({
        link: LinkBlock,
        textBlocks,
        orderedList: { element: (props, tag) => <Typography component={tag} sx={listItemSx} {...props} /> },
        unorderedList: { element: (props, tag) => <Typography component={tag} sx={listItemSx} {...props} /> },
        listLevelMax: 4,
    }),
    name: "RichText",
    displayName: <FormattedMessage id="richTextBlock.displayName" defaultMessage="Rich Text" />,
};
