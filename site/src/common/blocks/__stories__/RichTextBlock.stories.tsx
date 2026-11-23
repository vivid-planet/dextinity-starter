import { PageContentRichTextBlock, RichTextBlock } from "@src/common/blocks/RichTextBlock";
import {
    createExternalLink,
    createHeadingNode,
    createList,
    createParagraph,
    createRichText,
    emptyRichText,
    loremIpsum,
} from "@src/storybook/blockFixtures";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const meta: Meta<typeof RichTextBlock> = {
    title: "Blocks/Common/RichTextBlock",
    component: RichTextBlock,
    args: {
        data: createRichText(
            createHeadingNode("Rich text"),
            createParagraph(loremIpsum),
            {
                type: "textBlock",
                attrs: { textBlock: "paragraph" },
                content: [
                    { type: "text", text: "Bold", marks: [{ type: "bold" }] },
                    { type: "text", text: ", " },
                    { type: "text", text: "italic", marks: [{ type: "italic" }] },
                    { type: "text", text: " and " },
                    { type: "text", text: "struck through", marks: [{ type: "strike" }] },
                    { type: "text", text: " text." },
                ],
            },
            {
                type: "textBlock",
                attrs: { textBlock: "paragraph" },
                content: [
                    { type: "text", text: "A paragraph with a link to " },
                    { type: "text", text: "dextinity.com", marks: [{ type: "link", attrs: { data: createExternalLink() } }] },
                    { type: "text", text: "." },
                ],
            },
            createParagraph("A small paragraph.", { textBlockStyle: "small" }),
            createList("bulletList", "Unordered list item", "Another unordered list item"),
            createList(
                "orderedList",
                "Ordered list item",
                [createParagraph("Ordered list item with a nested list"), createList("orderedList", "Nested ordered list item")],
                "Another ordered list item",
            ),
        ),
    },
};

export default meta;
type Story = StoryObj<typeof RichTextBlock>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole("link", { name: "dextinity.com" })).toHaveAttribute("href", "https://www.dextinity.com");
    },
};

export const Headings: Story = {
    args: {
        data: createRichText(
            createHeadingNode("Heading 1", { level: 1 }),
            createHeadingNode("Heading 2", { level: 2 }),
            createHeadingNode("Heading 3", { level: 3 }),
            createHeadingNode("Heading 4", { level: 4 }),
            createHeadingNode("Heading 5", { level: 5 }),
            createHeadingNode("Heading 6", { level: 6 }),
        ),
    },
};

export const TextAlignment: Story = {
    args: {
        data: createRichText(
            { type: "textBlock", attrs: { textBlock: "paragraph", textAlign: "center" }, content: [{ type: "text", text: "Centered paragraph" }] },
            {
                type: "textBlock",
                attrs: { textBlock: "paragraph", textAlign: "right" },
                content: [{ type: "text", text: "Right-aligned paragraph" }],
            },
        ),
    },
};

export const WithoutLastBottomSpacing: Story = {
    args: { data: createRichText(createParagraph(loremIpsum), createParagraph(loremIpsum)), disableLastBottomSpacing: true },
};

export const InPageContent: Story = {
    render: (args) => <PageContentRichTextBlock {...args} />,
};

export const Empty: Story = {
    args: { data: emptyRichText },
};
