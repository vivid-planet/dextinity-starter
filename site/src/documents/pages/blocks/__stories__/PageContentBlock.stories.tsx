import type { PageContentBlockData } from "@src/blocks.generated";
import { PageContentBlock } from "@src/documents/pages/blocks/PageContentBlock";
import {
    createBlocksItems,
    createCallToActionList,
    createHeading,
    createImageMedia,
    createListItems,
    createParagraph,
    createRichText,
    createSpace,
    loremIpsum,
} from "@src/storybook/blockFixtures";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { createKeyFactsItem, createTeaserItem } from "./pageBlockFixtures";

const meta: Meta<typeof PageContentBlock> = {
    title: "Blocks/Pages/PageContentBlock",
    component: PageContentBlock,
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component: "The content of a page, composed of the blocks an editor can add to it.",
            },
        },
    },
    args: {
        data: {
            blocks: createBlocksItems<PageContentBlockData["blocks"][number]["props"]>([
                { type: "heading", props: createHeading({ headline: "Page headline", level: 1 }) },
                {
                    type: "richtext",
                    props: createRichText(createParagraph(loremIpsum), createParagraph(loremIpsum)),
                },
                { type: "space", props: createSpace("d200") },
                {
                    type: "teaser",
                    props: {
                        blocks: createListItems([
                            createTeaserItem("First teaser", "page-teaser-1"),
                            createTeaserItem("Second teaser", "page-teaser-2"),
                            createTeaserItem("Third teaser", "page-teaser-3"),
                        ]),
                    },
                },
                { type: "space", props: createSpace("d200") },
                {
                    type: "billboardTeaser",
                    props: {
                        media: createImageMedia({ seed: "page-billboard" }),
                        heading: createHeading({ headline: "Billboard teaser" }),
                        text: createRichText(createParagraph(loremIpsum)),
                        overlay: 50,
                        callToActionList: createCallToActionList({ text: "Discover more", variant: "contained" }),
                    },
                },
                { type: "space", props: createSpace("d200") },
                {
                    type: "keyFacts",
                    props: {
                        blocks: createListItems([
                            createKeyFactsItem({ fact: "250+", label: "Projects" }),
                            createKeyFactsItem({ fact: "20", label: "Years of experience" }),
                            createKeyFactsItem({ fact: "99%", label: "Uptime" }),
                        ]),
                    },
                },
            ]),
        },
    },
};

export default meta;
type Story = StoryObj<typeof PageContentBlock>;

export const Default: Story = {};
