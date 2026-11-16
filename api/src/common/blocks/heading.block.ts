import {
    BlockData,
    BlockDataInterface,
    BlockInput,
    blockInputToData,
    ChildBlock,
    ChildBlockInput,
    createBlock,
    ExtractBlockInput,
    typeSafeBlockMigrationPipe,
} from "@dextinity/cms-api";

import { EyebrowRichTextBlock } from "./eyebrow-rich-text.block";
import { HeadlineRichTextBlock } from "./headline-rich-text.block";
import { MoveHtmlTagIntoHeadlineMigration } from "./migrations/heading/1-move-html-tag-into-headline.migration";

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

export const HeadingBlock = createBlock(HeadingBlockData, HeadingBlockInput, {
    name: "Heading",
    migrate: {
        version: 1,
        migrations: typeSafeBlockMigrationPipe([MoveHtmlTagIntoHeadlineMigration]),
    },
});
