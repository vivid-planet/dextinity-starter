import { BillboardTeaserBlock } from "@src/documents/pages/blocks/BillboardTeaserBlock";
import { createCallToActionList, createHeading, createImageMedia, createParagraph, createRichText, loremIpsum } from "@src/storybook/blockFixtures";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta<typeof BillboardTeaserBlock> = {
    title: "Blocks/Pages/BillboardTeaserBlock",
    component: BillboardTeaserBlock,
    parameters: { layout: "fullscreen" },
    args: {
        data: {
            media: createImageMedia({ seed: "billboard" }),
            heading: createHeading({ headline: "Billboard teaser", eyebrow: "Eyebrow" }),
            text: createRichText(createParagraph(loremIpsum)),
            overlay: 50,
            callToActionList: createCallToActionList({ text: "Discover more", variant: "contained" }),
        },
    },
};

export default meta;
type Story = StoryObj<typeof BillboardTeaserBlock>;

export const Default: Story = {};
