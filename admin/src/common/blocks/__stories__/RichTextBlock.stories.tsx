import type { BlockState } from "@dextinity/cms-admin";
import { RichTextBlock } from "@src/common/blocks/RichTextBlock";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

function RichTextBlockStory() {
    const [state, setState] = useState<BlockState<typeof RichTextBlock>>(RichTextBlock.defaultValues());

    return <RichTextBlock.AdminComponent state={state} updateState={setState} />;
}

const meta: Meta<typeof RichTextBlockStory> = {
    title: "Blocks/RichTextBlock",
    component: RichTextBlockStory,
};

export default meta;
type Story = StoryObj<typeof RichTextBlockStory>;

export const Default: Story = {};

export const TypeText: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const editor = await canvas.findByRole("textbox", {}, { timeout: 5000 });

        await userEvent.click(editor);
        await userEvent.keyboard("Hello Dextinity");

        await waitFor(() => expect(editor).toHaveTextContent("Hello Dextinity"));
    },
};
