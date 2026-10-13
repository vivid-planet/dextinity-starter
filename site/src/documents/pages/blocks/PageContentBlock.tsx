"use client";
import { BlocksBlock, type PropsWithData, type SupportedBlocks } from "@dextinity/site-nextjs";
import type { PageContentBlockData } from "@src/blocks.generated";
import { PageContentAccordionBlock } from "@src/common/blocks/AccordionBlock";
import { AnchorBlock } from "@src/common/blocks/AnchorBlock";
import { PageContentMediaGalleryBlock } from "@src/common/blocks/MediaGalleryBlock";
import { PageTreeIndexBlock } from "@src/common/blocks/PageTreeIndexBlock";
import { SpaceBlock } from "@src/common/blocks/SpaceBlock";
import { PageContentStandaloneCallToActionListBlock } from "@src/common/blocks/StandaloneCallToActionListBlock";
import { PageContentStandaloneHeadingBlock } from "@src/common/blocks/StandaloneHeadingBlock";
import { StandaloneMediaBlock } from "@src/common/blocks/StandaloneMediaBlock";
import { PageContentStandaloneRichTextBlock } from "@src/common/blocks/StandaloneRichTextBlock";
import { BillboardTeaserBlock } from "@src/documents/pages/blocks/BillboardTeaserBlock";
import { ColumnsBlock } from "@src/documents/pages/blocks/ColumnsBlock";
import { ContentGroupBlock } from "@src/documents/pages/blocks/ContentGroupBlock";
import { KeyFactsBlock } from "@src/documents/pages/blocks/KeyFactsBlock";
import { TeaserBlock } from "@src/documents/pages/blocks/TeaserBlock";

const supportedBlocks: SupportedBlocks = {
    accordion: (props) => <PageContentAccordionBlock data={props} />,
    anchor: (props) => <AnchorBlock data={props} />,
    billboardTeaser: (props) => <BillboardTeaserBlock data={props} />,
    space: (props) => <SpaceBlock data={props} />,
    teaser: (props) => <TeaserBlock data={props} />,
    richtext: (props) => <PageContentStandaloneRichTextBlock data={props} />,
    heading: (props) => <PageContentStandaloneHeadingBlock data={props} />,
    columns: (props) => <ColumnsBlock data={props} />,
    callToActionList: (props) => <PageContentStandaloneCallToActionListBlock data={props} />,
    keyFacts: (props) => <KeyFactsBlock data={props} />,
    media: (props) => <StandaloneMediaBlock data={props} />,
    contentGroup: (props) => <ContentGroupBlock data={props} />,
    mediaGallery: (props) => <PageContentMediaGalleryBlock data={props} />,
    pageTreeIndex: (props) => <PageTreeIndexBlock data={props} />,
};

export const PageContentBlock = ({ data }: PropsWithData<PageContentBlockData>) => {
    return <BlocksBlock data={data} supportedBlocks={supportedBlocks} />;
};
