import type { AccordionContentBlockData } from "@src/blocks.generated";
import { AccordionItemBlock } from "@src/common/blocks/AccordionItemBlock";
import {
    createBlocksItems,
    createCallToActionList,
    createHeading,
    createParagraph,
    createRichText,
    createSpace,
    loremIpsum,
} from "@src/storybook/blockFixtures";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { fn } from "storybook/test";

const meta: Meta<typeof AccordionItemBlock> = {
    title: "Blocks/Common/AccordionItemBlock",
    component: AccordionItemBlock,
    args: {
        isExpanded: true,
        onChange: fn(),
        data: {
            title: "Accordion item",
            titleHtmlTag: "h3",
            openByDefault: false,
            content: {
                blocks: createBlocksItems<AccordionContentBlockData["blocks"][number]["props"]>([
                    { type: "heading", props: createHeading({ headline: "Heading inside an accordion" }) },
                    { type: "richtext", props: createRichText(createParagraph(loremIpsum)) },
                    { type: "space", props: createSpace("s300") },
                    {
                        type: "callToActionList",
                        props: { callToActionList: createCallToActionList({ text: "Learn more", variant: "contained" }), alignment: "left" },
                    },
                ]),
            },
        },
    },
};

export default meta;
type Story = StoryObj<typeof AccordionItemBlock>;

export const Expanded: Story = {};

export const Collapsed: Story = {
    args: { isExpanded: false },
};
