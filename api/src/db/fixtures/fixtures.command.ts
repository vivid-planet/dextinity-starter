import { DependenciesService } from "@dextinity/cms-api";
import { CreateRequestContext, MikroORM } from "@mikro-orm/core";
import { Inject, Logger } from "@nestjs/common";
import { Config } from "@src/config/config";
import { CONFIG } from "@src/config/config.module";
import { faker } from "@src/db/fixtures/faker";
import { MultiBar, Options, Presets } from "cli-progress";
import { Command, CommandRunner } from "nest-commander";

import { DocumentGeneratorService } from "./generators/document-generator.service";
import { ImageFixtureService } from "./generators/image-fixture.service";
import { VideoFixtureService } from "./generators/video-fixture.service";

@Command({
    name: "fixtures",
    description: "Create fixtures with faker.js",
})
export class FixturesCommand extends CommandRunner {
    private readonly logger = new Logger(FixturesCommand.name);

    barOptions: Options = {
        format: `{bar} {percentage}% | {value}/{total} {title} | ETA: {eta_formatted} | Duration: {duration_formatted}`,
        noTTYOutput: true,
    };

    constructor(
        @Inject(CONFIG) private readonly config: Config,
        private readonly dependenciesService: DependenciesService,
        private readonly documentGeneratorService: DocumentGeneratorService,
        private readonly imageFixtureService: ImageFixtureService,
        private readonly videoFixtureService: VideoFixtureService,
        private readonly orm: MikroORM,
    ) {
        super();
    }

    @CreateRequestContext()
    async run(): Promise<void> {
        faker.seed(1234);

        this.logger.log(`Drop tables...`);
        const connection = this.orm.em.getConnection();
        const tables = await connection.execute(`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename;`);

        for (const table of tables) {
            await connection.execute(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE`);
        }

        this.logger.log(`Run migrations...`);
        const migrator = this.orm.getMigrator();
        await migrator.up();

        const multiBar = new MultiBar(this.barOptions, Presets.shades_classic);

        const scope = { domain: "main", language: "en" };

        this.logger.log(`Generate Images...`);
        await this.imageFixtureService.generateImages(5);

        this.logger.log(`Generate Videos...`);
        await this.videoFixtureService.generateVideos();

        this.logger.log("Generate Pages...");
        await this.documentGeneratorService.generatePage({ name: "Home", scope });
        const blockCategoriesPage = await this.documentGeneratorService.generatePage({ name: "Fixtures: Blocks", scope });

        await this.documentGeneratorService.generatePage({ name: "Layout", scope, blockCategory: "layout", parentId: blockCategoriesPage.id });
        await this.documentGeneratorService.generatePage({ name: "Media", scope, blockCategory: "media", parentId: blockCategoriesPage.id });
        await this.documentGeneratorService.generatePage({
            name: "Navigation",
            scope,
            blockCategory: "navigation",
            parentId: blockCategoriesPage.id,
        });
        await this.documentGeneratorService.generatePage({ name: "Teaser", scope, blockCategory: "teaser", parentId: blockCategoriesPage.id });
        await this.documentGeneratorService.generatePage({
            name: "Text and Content",
            scope,
            blockCategory: "textAndContent",
            parentId: blockCategoriesPage.id,
        });

        multiBar.stop();
        await this.dependenciesService.createViews();
        await this.orm.em.flush();
    }
}
