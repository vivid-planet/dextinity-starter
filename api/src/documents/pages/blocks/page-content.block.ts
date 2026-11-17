import { AnchorBlock, createBlocksBlock } from "@dextinity/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block.js";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block.js";
import { PageTreeIndexBlock } from "@src/common/blocks/page-tree-index.block.js";
import { SpaceBlock } from "@src/common/blocks/space.block.js";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block.js";
import { StandaloneHeadingBlock } from "@src/common/blocks/standalone-heading.block.js";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block.js";
import { StandaloneRichTextBlock } from "@src/common/blocks/standalone-rich-text.block.js";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/billboard-teaser.block.js";
import { ColumnsBlock } from "@src/documents/pages/blocks/columns.block.js";
import { ContentGroupBlock } from "@src/documents/pages/blocks/content-group.block.js";
import { KeyFactsBlock } from "@src/documents/pages/blocks/key-facts.block.js";
import { SliderBlock } from "@src/documents/pages/blocks/slider.block.js";
import { TeaserBlock } from "@src/documents/pages/blocks/teaser.block.js";

export const PageContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            accordion: AccordionBlock,
            anchor: AnchorBlock,
            billboardTeaser: BillboardTeaserBlock,
            space: SpaceBlock,
            teaser: TeaserBlock,
            richtext: StandaloneRichTextBlock,
            heading: StandaloneHeadingBlock,
            columns: ColumnsBlock,
            callToActionList: StandaloneCallToActionListBlock,
            keyFacts: KeyFactsBlock,
            media: StandaloneMediaBlock,
            contentGroup: ContentGroupBlock,
            mediaGallery: MediaGalleryBlock,
            pageTreeIndex: PageTreeIndexBlock,
            slider: SliderBlock,
        },
    },
    "PageContent",
);
