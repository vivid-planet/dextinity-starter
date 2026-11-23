import { ExtractBlockInputFactoryProps } from "@dextinity/cms-api";
import { Injectable } from "@nestjs/common";
import { RichTextBlock } from "@src/common/blocks/rich-text.block";
import { faker } from "@src/db/fixtures/faker";

@Injectable()
export class RichTextBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof RichTextBlock>> {
        return {
            tipTapContent: {
                type: "doc",
                content: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
                    type: "textBlock",
                    attrs: { textBlock: "paragraph", textBlockStyle: faker.helpers.arrayElement(["standard", "small"]) },
                    content: [{ type: "text", text: faker.lorem.paragraph() }],
                })),
            },
        };
    }
}
