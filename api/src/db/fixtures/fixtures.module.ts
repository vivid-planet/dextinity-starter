import { DependenciesModule } from "@dextinity/cms-api";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@src/config/config.module.js";
import { DamFile } from "@src/dam/entities/dam-file.entity.js";
import { Link } from "@src/documents/links/entities/link.entity.js";
import { LinksModule } from "@src/documents/links/links.module.js";
import { Page } from "@src/documents/pages/entities/page.entity.js";
import { PagesModule } from "@src/documents/pages/pages.module.js";

import { FixturesCommand } from "./fixtures.command.js";
import { AccordionBlockFixtureService } from "./generators/blocks/layout/accordion-block-fixture.service.js";
import { ColumnsBlockFixtureService } from "./generators/blocks/layout/columns-block-fixture.service.js";
import { ContentGroupBlockFixtureService } from "./generators/blocks/layout/content-group-block-fixture.service.js";
import { SpaceBlockFixtureService } from "./generators/blocks/layout/space-block-fixture.service.js";
import { DamImageBlockFixtureService } from "./generators/blocks/media/dam-image-block-fixture.service.js";
import { DamVideoBlockFixtureService } from "./generators/blocks/media/dam-video-block-fixture.service.js";
import { MediaBlockFixtureService } from "./generators/blocks/media/media-block.fixture.service.js";
import { MediaGalleryBlockFixtureService } from "./generators/blocks/media/media-gallery-block-fixture.service.js";
import { PixelImageBlockFixtureService } from "./generators/blocks/media/pixel-image-block-fixture.service.js";
import { SliderBlockFixtureService } from "./generators/blocks/media/slider-block-fixture.service.js";
import { StandaloneMediaBlockFixtureService } from "./generators/blocks/media/standalone-media-block-fixture.service.js";
import { SvgImageBlockFixtureService } from "./generators/blocks/media/svg-image-block-fixture.service.js";
import { VimeoVideoBlockFixtureService } from "./generators/blocks/media/vimeo-video-block-fixture.service.js";
import { YouTubeVideoBlockFixtureService } from "./generators/blocks/media/youtube-video-block-fixture.service.js";
import { AnchorBlockFixtureService } from "./generators/blocks/navigation/anchor-block-fixture.service.js";
import { CallToActionBlockFixtureService } from "./generators/blocks/navigation/call-to-action-block-fixture.service.js";
import { CallToActionListBlockFixtureService } from "./generators/blocks/navigation/call-to-action-list-block.service.js";
import { LinkBlockFixtureService } from "./generators/blocks/navigation/link-block-fixture.service.js";
import { LinkListBlockFixtureService } from "./generators/blocks/navigation/link-list-block-fixture.service.js";
import { PageTreeIndexBlockFixtureService } from "./generators/blocks/navigation/page-tree-index-block-fixture.service.js";
import { StandaloneCallToActionListBlockFixtureService } from "./generators/blocks/navigation/standalone-call-to-action-list-block-fixture.service.js";
import { TextLinkBlockFixtureService } from "./generators/blocks/navigation/text-link-block-fixture.service.js";
import { BasicStageBlockFixtureService } from "./generators/blocks/stage/basic-stage-block-fixture.service.js";
import { BillboardTeaserBlockFixtureService } from "./generators/blocks/teaser/billboard-teaser-block-fixture.service.js";
import { TeaserBlockFixtureService } from "./generators/blocks/teaser/teaser-block-fixture.service.js";
import { HeadingBlockFixtureService } from "./generators/blocks/text-and-content/heading-block-fixture.service.js";
import { KeyFactsBlockFixtureService } from "./generators/blocks/text-and-content/key-facts-block-fixture.service.js";
import { RichTextBlockFixtureService } from "./generators/blocks/text-and-content/rich-text-block-fixture.service.js";
import { StandaloneHeadingBlockFixtureService } from "./generators/blocks/text-and-content/standalone-heading-block-fixture.service.js";
import { StandaloneRichTextBlockFixtureService } from "./generators/blocks/text-and-content/standalone-rich-text-block-fixture.service.js";
import { DocumentGeneratorService } from "./generators/document-generator.service.js";
import { ImageFixtureService } from "./generators/image-fixture.service.js";
import { PageContentBlockFixtureService } from "./generators/page-content-block-fixture.service.js";
import { SeoBlockFixtureService } from "./generators/seo-block-fixture.service.js";
import { StageBlockFixtureService } from "./generators/stage-block-fixture.service.js";
import { VideoFixtureService } from "./generators/video-fixture.service.js";

@Module({
    imports: [ConfigModule, PagesModule, LinksModule, DependenciesModule, MikroOrmModule.forFeature([DamFile, Page, Link])],
    providers: [
        AccordionBlockFixtureService,
        AnchorBlockFixtureService,
        BasicStageBlockFixtureService,
        BillboardTeaserBlockFixtureService,
        CallToActionBlockFixtureService,
        CallToActionListBlockFixtureService,
        ColumnsBlockFixtureService,
        ContentGroupBlockFixtureService,
        DamImageBlockFixtureService,
        DamVideoBlockFixtureService,
        DocumentGeneratorService,
        FixturesCommand,
        HeadingBlockFixtureService,
        ImageFixtureService,
        KeyFactsBlockFixtureService,
        LinkBlockFixtureService,
        LinkListBlockFixtureService,
        MediaGalleryBlockFixtureService,
        MediaBlockFixtureService,
        PageContentBlockFixtureService,
        PageTreeIndexBlockFixtureService,
        PixelImageBlockFixtureService,
        RichTextBlockFixtureService,
        SeoBlockFixtureService,
        SliderBlockFixtureService,
        SpaceBlockFixtureService,
        StageBlockFixtureService,
        SvgImageBlockFixtureService,
        StageBlockFixtureService,
        StandaloneCallToActionListBlockFixtureService,
        StandaloneRichTextBlockFixtureService,
        StandaloneHeadingBlockFixtureService,
        StandaloneMediaBlockFixtureService,
        TeaserBlockFixtureService,
        TextLinkBlockFixtureService,
        VideoFixtureService,
        VimeoVideoBlockFixtureService,
        YouTubeVideoBlockFixtureService,
    ],
})
export class FixturesModule {}
