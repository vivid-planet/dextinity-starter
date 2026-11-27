import { Stack } from "@dextinity/admin";
import type { BlockState } from "@dextinity/cms-admin";
import { HeadingBlock } from "@src/common/blocks/HeadingBlock";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

function HeadingBlockStory() {
    const [state, setState] = useState<BlockState<typeof HeadingBlock>>(HeadingBlock.defaultValues());

    // Composite blocks open their settings as a sub-page of the surrounding stack, as on a page in the admin.
    return (
        <Stack topLevelTitle={null}>
            <HeadingBlock.AdminComponent state={state} updateState={setState} />
        </Stack>
    );
}

const meta: Meta<typeof HeadingBlockStory> = {
    title: "Blocks/HeadingBlock",
    component: HeadingBlockStory,
};

export default meta;
type Story = StoryObj<typeof HeadingBlockStory>;

export const Default: Story = {};

export const TypeHeadline: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        const [, headlineEditor] = await canvas.findAllByRole("textbox", {}, { timeout: 5000 });

        await userEvent.click(headlineEditor);
        await userEvent.keyboard("Hello Dextinity");

        await waitFor(() => expect(headlineEditor).toHaveTextContent("Hello Dextinity"));
    },
};
