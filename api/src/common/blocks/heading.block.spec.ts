import { describe, expect, it } from "vitest";

import { HeadingBlock } from "./heading.block";

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

function migrate(raw: Record<string, unknown>) {
    return HeadingBlock.blockDataFactory(raw).transformToSave() as {
        $$version?: number;
        htmlTag?: unknown;
        eyebrow: { tipTapContent: unknown };
        headline: { tipTapContent: unknown };
    };
}

const emptyEyebrow = { draftContent: draftContent([]) };

const draftJsSizes = [
    ["header-one", "size600"],
    ["header-two", "size550"],
    ["header-three", "size500"],
    ["header-four", "size450"],
    ["header-five", "size400"],
    ["header-six", "size350"],
] as const;

const htmlTags = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

describe("HeadingBlock", () => {
    describe("migrating a Draft.js heading", () => {
        for (const htmlTag of htmlTags) {
            for (const [draftJsType, size] of draftJsSizes) {
                it(`turns the ${htmlTag} tag into the text block and ${draftJsType} into ${size}`, () => {
                    const migrated = migrate({
                        htmlTag,
                        eyebrow: emptyEyebrow,
                        headline: { draftContent: draftContent([{ type: draftJsType, text: "Headline" }]) },
                    });

                    expect(migrated.headline.tipTapContent).toEqual({
                        type: "doc",
                        content: [
                            {
                                type: "textBlock",
                                attrs: { textBlock: `heading-${htmlTag.slice(1)}`, textBlockStyle: size },
                                content: [{ type: "text", text: "Headline" }],
                            },
                        ],
                    });
                });
            }
        }

        it("drops the htmlTag field", () => {
            const migrated = migrate({
                htmlTag: "h1",
                eyebrow: emptyEyebrow,
                headline: { draftContent: draftContent([{ type: "header-one", text: "Headline" }]) },
            });

            expect(migrated).not.toHaveProperty("htmlTag");
            expect(migrated.$$version).toBe(1);
        });

        for (const draftJsType of ["unstyled", "paragraph-standard", "paragraph-small"]) {
            it(`keeps the tag of a ${draftJsType} headline and gives it the default size`, () => {
                const migrated = migrate({
                    htmlTag: "h3",
                    eyebrow: emptyEyebrow,
                    headline: { draftContent: draftContent([{ type: draftJsType, text: "Headline" }]) },
                });

                expect(migrated.headline.tipTapContent).toMatchObject({
                    content: [{ attrs: { textBlock: "heading-3", textBlockStyle: "size600" } }],
                });
            });
        }

        it("falls back to heading 2, the default of the removed field, when the tag is missing", () => {
            const migrated = migrate({
                eyebrow: emptyEyebrow,
                headline: { draftContent: draftContent([{ type: "header-four", text: "Headline" }]) },
            });

            expect(migrated.headline.tipTapContent).toMatchObject({
                content: [{ attrs: { textBlock: "heading-2", textBlockStyle: "size450" } }],
            });
        });

        for (const htmlTag of htmlTags) {
            it(`keeps the ${htmlTag} tag of an empty headline`, () => {
                const migrated = migrate({ htmlTag, eyebrow: emptyEyebrow, headline: { draftContent: draftContent([]) } });

                expect(migrated.headline.tipTapContent).toEqual({
                    type: "doc",
                    content: [{ type: "textBlock", attrs: { textBlock: `heading-${htmlTag.slice(1)}`, textBlockStyle: "size600" } }],
                });
            });
        }

        it("keeps the inline styles of the headline", () => {
            const migrated = migrate({
                htmlTag: "h2",
                eyebrow: emptyEyebrow,
                headline: {
                    draftContent: draftContent([
                        { type: "header-two", text: "Bold text", inlineStyleRanges: [{ style: "BOLD", offset: 0, length: 4 }] },
                    ]),
                },
            });

            expect(migrated.headline.tipTapContent).toMatchObject({
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

        for (const [draftJsType] of draftJsSizes) {
            it(`turns a ${draftJsType} eyebrow into a paragraph`, () => {
                const migrated = migrate({
                    htmlTag: "h2",
                    eyebrow: { draftContent: draftContent([{ type: draftJsType, text: "Eyebrow" }]) },
                    headline: { draftContent: draftContent([{ type: "header-one", text: "Headline" }]) },
                });

                expect(migrated.eyebrow.tipTapContent).toEqual({
                    type: "doc",
                    content: [{ type: "textBlock", attrs: { textBlock: "paragraph" }, content: [{ type: "text", text: "Eyebrow" }] }],
                });
            });
        }

        it("drops links from the eyebrow", () => {
            const migrated = migrate({
                htmlTag: "h2",
                eyebrow: {
                    draftContent: draftContent([{ type: "unstyled", text: "Eyebrow", entityRanges: [{ key: 0, offset: 0, length: 7 }] }], {
                        0: {
                            type: "LINK",
                            mutability: "MUTABLE",
                            data: { attachedBlocks: [{ type: "external", props: { targetUrl: "https://www.example.com" } }], activeType: "external" },
                        },
                    }),
                },
                headline: { draftContent: draftContent([{ type: "header-one", text: "Headline" }]) },
            });

            expect(JSON.stringify(migrated.eyebrow.tipTapContent)).not.toContain("link");
        });
    });
});
