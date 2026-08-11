import { ExtractBlockInputFactoryProps } from "@dextinity/cms-api";
import { Injectable } from "@nestjs/common";
import { faker } from "@src/db/fixtures/faker";
import { PageContentBlock } from "@src/documents/pages/blocks/page-content.block";

import { BlockFixture } from "./blocks/block-fixture";
import { AccordionBlockFixtureService } from "./blocks/layout/accordion-block-fixture.service";
import { ColumnsBlockFixtureService } from "./blocks/layout/columns-block-fixture.service";
import { ContentGroupBlockFixtureService } from "./blocks/layout/content-group-block-fixture.service";
import { SpaceBlockFixtureService } from "./blocks/layout/space-block-fixture.service";
import { MediaGalleryBlockFixtureService } from "./blocks/media/media-gallery-block-fixture.service";
import { StandaloneMediaBlockFixtureService } from "./blocks/media/standalone-media-block-fixture.service";
import { AnchorBlockFixtureService } from "./blocks/navigation/anchor-block-fixture.service";
import { PageTreeIndexBlockFixtureService } from "./blocks/navigation/page-tree-index-block-fixture.service";
import { StandaloneCallToActionListBlockFixtureService } from "./blocks/navigation/standalone-call-to-action-list-block-fixture.service";
import { BillboardTeaserBlockFixtureService } from "./blocks/teaser/billboard-teaser-block-fixture.service";
import { TeaserBlockFixtureService } from "./blocks/teaser/teaser-block-fixture.service";
import { KeyFactsBlockFixtureService } from "./blocks/text-and-content/key-facts-block-fixture.service";
import { StandaloneHeadingBlockFixtureService } from "./blocks/text-and-content/standalone-heading-block-fixture.service";
import { StandaloneRichTextBlockFixtureService } from "./blocks/text-and-content/standalone-rich-text-block-fixture.service";

export type BlockCategory = "layout" | "media" | "navigation" | "teaser" | "textAndContent";

@Injectable()
export class PageContentBlockFixtureService {
    constructor(
        private readonly accordionBlockFixtureService: AccordionBlockFixtureService,
        private readonly anchorBlockFixtureService: AnchorBlockFixtureService,
        private readonly billboardTeaserBlockFixtureService: BillboardTeaserBlockFixtureService,
        private readonly callToActionListBlockFixtureService: StandaloneCallToActionListBlockFixtureService,
        private readonly columnsBlockFixtureService: ColumnsBlockFixtureService,
        private readonly contentGroupBlockFixtureService: ContentGroupBlockFixtureService,
        private readonly headingBlockFixtureService: StandaloneHeadingBlockFixtureService,
        private readonly keyFactsBlockFixtureService: KeyFactsBlockFixtureService,
        private readonly mediaGalleryBlockFixtureService: MediaGalleryBlockFixtureService,
        private readonly standaloneRichTextBlockFixtureService: StandaloneRichTextBlockFixtureService,
        private readonly spaceBlockFixtureService: SpaceBlockFixtureService,
        private readonly mediaBlockFixtureService: StandaloneMediaBlockFixtureService,
        private readonly teaserBlockFixtureService: TeaserBlockFixtureService,
        private readonly pageTreeIndexBlockFixtureService: PageTreeIndexBlockFixtureService,
    ) {}

    async generateBlockInput(blockCategory?: BlockCategory): Promise<ExtractBlockInputFactoryProps<typeof PageContentBlock>> {
        const blocks: ExtractBlockInputFactoryProps<typeof PageContentBlock>["blocks"] = [];

        type SupportedBlocks = (typeof blocks)[number]["type"];

        const fixtures: Record<SupportedBlocks, [BlockCategory, BlockFixture]> = {
            accordion: ["layout", this.accordionBlockFixtureService],
            columns: ["layout", this.columnsBlockFixtureService],
            contentGroup: ["layout", this.contentGroupBlockFixtureService],
            space: ["layout", this.spaceBlockFixtureService],
            media: ["media", this.mediaBlockFixtureService],
            mediaGallery: ["media", this.mediaGalleryBlockFixtureService],
            anchor: ["navigation", this.anchorBlockFixtureService],
            callToActionList: ["navigation", this.callToActionListBlockFixtureService],
            billboardTeaser: ["teaser", this.billboardTeaserBlockFixtureService],
            teaser: ["teaser", this.teaserBlockFixtureService],
            heading: ["textAndContent", this.headingBlockFixtureService],
            keyFacts: ["textAndContent", this.keyFactsBlockFixtureService],
            richtext: ["textAndContent", this.standaloneRichTextBlockFixtureService],
            pageTreeIndex: ["navigation", this.pageTreeIndexBlockFixtureService],
        };

        const supportedBlocksFixtureGenerators = Object.entries(fixtures)
            .filter(([, [category]]) => (blockCategory ? category === blockCategory : true))
            .map<[string, BlockFixture]>(([type, [, generator]]) => [type, generator]);

        for (const [type, generator] of supportedBlocksFixtureGenerators) {
            const props = await generator.generateBlockInput();

            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: type as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                props: props as any,
            });
        }

        return { blocks };
    }
}
