import { AnchorBlock, createBlocksBlock } from "@dextinity/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { PageTreeIndexBlock } from "@src/common/blocks/page-tree-index.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneHeadingBlock } from "@src/common/blocks/standalone-heading.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { StandaloneRichTextBlock } from "@src/common/blocks/standalone-rich-text.block";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/billboard-teaser.block";
import { ColumnsBlock } from "@src/documents/pages/blocks/columns.block";
import { ContentGroupBlock } from "@src/documents/pages/blocks/content-group.block";
import { KeyFactsBlock } from "@src/documents/pages/blocks/key-facts.block";
import { TeaserBlock } from "@src/documents/pages/blocks/teaser.block";

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
        },
    },
    "PageContent",
);
