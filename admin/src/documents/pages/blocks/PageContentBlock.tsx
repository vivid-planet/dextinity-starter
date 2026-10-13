import { AnchorBlock, createBlocksBlock } from "@dextinity/cms-admin";
import { AccordionBlock } from "@src/common/blocks/AccordionBlock";
import { MediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { PageTreeIndexBlock } from "@src/common/blocks/PageTreeIndexBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { StandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { StandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { StandaloneRichTextBlock } from "@src/common/blocks/StandaloneRichTextBlock";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/BillboardTeaserBlock";
import { ColumnsBlock } from "@src/documents/pages/blocks/ColumnsBlock";
import { ContentGroupBlock } from "@src/documents/pages/blocks/ContentGroupBlock";
import { KeyFactsBlock } from "@src/documents/pages/blocks/KeyFactsBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";

export const PageContentBlock = createBlocksBlock({
    name: "PageContent",
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
});
