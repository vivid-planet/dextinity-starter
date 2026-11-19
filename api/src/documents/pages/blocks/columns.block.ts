import { AnchorBlock, ColumnsBlockFactory, createBlocksBlock } from "@dextinity/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { HeadingBlock } from "@src/common/blocks/heading.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";

export const ColumnsContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            accordion: AccordionBlock,
            anchor: AnchorBlock,
            richtext: RichTextBlock,
            space: SpaceBlock,
            heading: HeadingBlock,
            callToActionList: StandaloneCallToActionListBlock,
            media: StandaloneMediaBlock,
            mediaGallery: MediaGalleryBlock,
        },
    },
    { name: "ColumnsContent" },
);

export const ColumnsBlock = ColumnsBlockFactory.create(
    {
        layouts: [{ name: "2-20-2" }, { name: "4-16-4" }, { name: "6-12-6" }, { name: "9-9" }, { name: "12-6" }, { name: "6-12" }],
        contentBlock: ColumnsContentBlock,
    },
    "Columns",
);
