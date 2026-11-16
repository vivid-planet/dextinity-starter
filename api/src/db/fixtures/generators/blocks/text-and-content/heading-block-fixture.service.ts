import { ExtractBlockInputFactoryProps } from "@dextinity/cms-api";
import { Injectable } from "@nestjs/common";
import { HeadingBlock } from "@src/common/blocks/heading.block";
import { faker } from "@src/db/fixtures/faker";

const headlineTextBlocks = ["heading-1", "heading-2", "heading-3", "heading-4", "heading-5", "heading-6"];

const headlineSizes = ["size600", "size550", "size500", "size450", "size400", "size350"];

@Injectable()
export class HeadingBlockFixtureService {
    async generateBlockInput(): Promise<ExtractBlockInputFactoryProps<typeof HeadingBlock>> {
        const textAlign = faker.helpers.arrayElement(["left", "center"]);

        return {
            eyebrow: {
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "textBlock",
                            attrs: { textBlock: "paragraph", textAlign },
                            content: [{ type: "text", text: faker.lorem.words({ min: 3, max: 9 }) }],
                        },
                    ],
                },
            },
            headline: {
                tipTapContent: {
                    type: "doc",
                    content: [
                        {
                            type: "textBlock",
                            attrs: {
                                textBlock: faker.helpers.arrayElement(headlineTextBlocks),
                                textBlockStyle: faker.helpers.arrayElement(headlineSizes),
                                textAlign,
                            },
                            content: [{ type: "text", text: faker.lorem.words({ min: 3, max: 9 }) }],
                        },
                    ],
                },
            },
        };
    }
}
