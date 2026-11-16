import { describe, expect, it } from "vitest";

import { DescriptionRichTextBlock } from "./description-rich-text.block";

function draftContent(
    blocks: Array<{
        type: string;
        text: string;
        inlineStyleRanges?: Array<{ style: string; offset: number; length: number }>;
        entityRanges?: Array<{ key: number; offset: number; length: number }>;
    }>,
    entityMap: Record<string, unknown> = {},
) {
    return {
        blocks: blocks.map((block, index) => ({ key: `key${index}`, depth: 0, inlineStyleRanges: [], entityRanges: [], data: {}, ...block })),
        entityMap,
    };
}

function migrate(draftJsContent: ReturnType<typeof draftContent>) {
    return (DescriptionRichTextBlock.blockDataFactory({ draftContent: draftJsContent }).transformToSave() as { tipTapContent: unknown })
        .tipTapContent;
}

describe("DescriptionRichTextBlock", () => {
    describe("migrating Draft.js content", () => {
        for (const draftJsType of ["unstyled", "paragraph-standard", "paragraph-small", "header-one", "header-six"]) {
            it(`turns a ${draftJsType} block into a paragraph`, () => {
                expect(migrate(draftContent([{ type: draftJsType, text: "Description" }]))).toEqual({
                    type: "doc",
                    content: [{ type: "textBlock", attrs: { textBlock: "paragraph" }, content: [{ type: "text", text: "Description" }] }],
                });
            });
        }

        it("keeps the inline styles", () => {
            expect(
                migrate(draftContent([{ type: "unstyled", text: "Bold text", inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }] }])),
            ).toMatchObject({
                content: [
                    {
                        content: [
                            { type: "text", text: "Bold", marks: [{ type: "bold" }] },
                            { type: "text", text: " text" },
                        ],
                    },
                ],
            });
        });

        it("drops links", () => {
            const migrated = migrate(
                draftContent([{ type: "unstyled", text: "Description", entityRanges: [{ key: 0, offset: 0, length: 11 }] }], {
                    0: {
                        type: "LINK",
                        mutability: "MUTABLE",
                        data: { attachedBlocks: [{ type: "external", props: { targetUrl: "https://www.example.com" } }], activeType: "external" },
                    },
                }),
            );

            expect(JSON.stringify(migrated)).not.toContain("link");
        });
    });
});
