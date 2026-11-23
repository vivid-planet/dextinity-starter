import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import { createHeading, createHeadingNode, createRichText } from "@src/storybook/blockFixtures";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const headlineSizes = ["size600", "size550", "size500", "size450", "size400", "size350"];

const meta: Meta<typeof HeadingBlock> = {
    title: "Blocks/Common/HeadingBlock",
    component: HeadingBlock,
    args: {
        data: createHeading({ eyebrow: "Eyebrow", headline: "Headline" }),
    },
};

export default meta;
type Story = StoryObj<typeof HeadingBlock>;

export const Default: Story = {};

export const WithoutEyebrow: Story = {
    args: { data: createHeading({ headline: "Headline without eyebrow" }) },
};

export const HeadingLevel: Story = {
    args: { data: createHeading({ headline: "Rendered as h1", level: 1 }) },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole("heading", { level: 1, name: "Rendered as h1" })).toBeInTheDocument();
    },
};

export const HeadlineSizes: Story = {
    render: () => (
        <>
            {headlineSizes.map((textBlockStyle) => (
                <HeadingBlock
                    key={textBlockStyle}
                    data={{
                        ...createHeading({ headline: "" }),
                        headline: createRichText(createHeadingNode(`Headline ${textBlockStyle}`, { textBlockStyle })),
                    }}
                />
            ))}
        </>
    ),
};
