import { ExtractBlockInputFactoryProps } from "@dextinity/cms-api";
import { Injectable } from "@nestjs/common";
import { faker } from "@src/db/fixtures/faker";
import { RichTextBlockFixtureService } from "@src/db/fixtures/generators/blocks/text-and-content/rich-text-block-fixture.service";
import { SliderBlock } from "@src/documents/pages/blocks/slider.block";

import { MediaBlockFixtureService } from "./media-block.fixture.service";

@Injectable()
export class SliderBlockFixtureService {
    constructor(
        private readonly richTextBlockFixtureService: RichTextBlockFixtureService,
        private readonly mediaBlockFixtureService: MediaBlockFixtureService,
    ) {}

    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof SliderBlock>> {
        const blockAmount = faker.number.int({ min: 2, max: 6 });
        const blocks = [];

        for (let i = 0; i < blockAmount; i++) {
            blocks.push({
                key: faker.string.uuid(),
                visible: true,
                props: {
                    text: await this.richTextBlockFixtureService.generateBlockInput(),
                    media: await this.mediaBlockFixtureService.generateBlockInput(),
                },
            });
        }

        return { blocks };
    }
}
