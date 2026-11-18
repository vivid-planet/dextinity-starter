import { ExtractBlockInputFactoryProps } from "@dextinity/cms-api";
import { Injectable } from "@nestjs/common";
import { DescriptionRichTextBlock } from "@src/common/blocks/description-rich-text.block";
import { faker } from "@src/db/fixtures/faker";

@Injectable()
export class DescriptionRichTextBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof DescriptionRichTextBlock>> {
        return {
            tipTapContent: {
                type: "doc",
                content: [{ type: "textBlock", attrs: { textBlock: "paragraph" }, content: [{ type: "text", text: faker.lorem.paragraph() }] }],
            },
        };
    }
}
