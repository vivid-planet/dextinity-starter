import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
} from "@dextinity/cms-api";

import { EyebrowRichTextBlock } from "./eyebrow-rich-text.block";
import { HeadlineRichTextBlock } from "./headline-rich-text.block";

class HeadingBlockData extends BlockData {
    @ChildBlock(EyebrowRichTextBlock)
    eyebrow: BlockDataInterface;

    @ChildBlock(HeadlineRichTextBlock)
    headline: BlockDataInterface;
}

class HeadingBlockInput extends BlockInput {
    @ChildBlockInput(EyebrowRichTextBlock)
    eyebrow: ExtractBlockInput<typeof EyebrowRichTextBlock>;

    @ChildBlockInput(HeadlineRichTextBlock)
    headline: ExtractBlockInput<typeof HeadlineRichTextBlock>;

    transformToBlockData(): HeadingBlockData {
        return blockInputToData(HeadingBlockData, this);
    }
}

export const HeadingBlock = createBlock(HeadingBlockData, HeadingBlockInput, "Heading");
