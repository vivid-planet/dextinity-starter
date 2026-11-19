import { AnchorBlock, createBlocksBlock } from "@dextinity/cms-api";
import { AccordionBlock } from "@src/common/blocks/accordion.block";
import { HeadingBlock } from "@src/common/blocks/heading.block";
import { MediaGalleryBlock } from "@src/common/blocks/media-gallery.block";
import { PageTreeIndexBlock } from "@src/common/blocks/page-tree-index.block";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { SpaceBlock } from "@src/common/blocks/space.block";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/standalone-call-to-action-list.block";
import { StandaloneMediaBlock } from "@src/common/blocks/standalone-media.block";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/billboard-teaser.block";
import { ColumnsBlock } from "@src/documents/pages/blocks/columns.block";
import { ContentGroupBlock } from "@src/documents/pages/blocks/content-group.block";
import { KeyFactsBlock } from "@src/documents/pages/blocks/key-facts.block";
import { SliderBlock } from "@src/documents/pages/blocks/slider.block";
import { TeaserBlock } from "@src/documents/pages/blocks/teaser.block";

export const PageContentBlock = createBlocksBlock(
    {
        supportedBlocks: {
            accordion: AccordionBlock,
            anchor: AnchorBlock,
            billboardTeaser: BillboardTeaserBlock,
            space: SpaceBlock,
            teaser: TeaserBlock,
            richtext: RichTextBlock,
            heading: HeadingBlock,
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
