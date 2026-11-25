import { FooterContentBlock } from "@src/layout/footer/blocks/FooterContentBlock";
import {
    createHeadingNode,
    createInternalLink,
    createListItems,
    createParagraph,
    createRichText,
    createSvgDamImage,
    createTextLink,
    emptyDamImage,
    loremIpsum,
} from "@src/storybook/blockFixtures";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const meta: Meta<typeof FooterContentBlock> = {
    title: "Blocks/Layout/FooterContentBlock",
    component: FooterContentBlock,
    parameters: { layout: "fullscreen" },
    args: {
        data: {
            text: createRichText(createHeadingNode("Dextinity", { level: 4 }), createParagraph(loremIpsum)),
            image: createSvgDamImage(),
            caption: "Image caption",
            linkList: {
                blocks: createListItems(
                    [
                        createTextLink("Imprint", createInternalLink("/imprint")),
                        createTextLink("Privacy policy", createInternalLink("/privacy-policy")),
                        createTextLink("Dextinity website"),
                    ],
                    "link",
                ),
            },
            copyrightNotice: "© Dextinity",
        },
    },
};

export default meta;
type Story = StoryObj<typeof FooterContentBlock>;

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const navigation = within(within(canvasElement).getByRole("navigation"));

        await expect(navigation.getByRole("link", { name: "Imprint" })).toHaveAttribute("href", "/en/imprint");
        await expect(navigation.getByRole("link", { name: "Dextinity website" })).toHaveAttribute("href", "https://www.dextinity.com");
    },
};

export const Minimal: Story = {
    args: {
        data: {
            text: createRichText(createParagraph(loremIpsum)),
            image: emptyDamImage,
            caption: "",
            linkList: { blocks: [] },
            copyrightNotice: "",
        },
    },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).queryByRole("navigation")).not.toBeInTheDocument();
    },
};
