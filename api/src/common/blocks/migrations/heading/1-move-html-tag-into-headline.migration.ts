import { BlockMigration, type BlockMigrationInterface } from "@dextinity/cms-api";
import { defaultHeadlineTag, getDraftJsTypeWithHeadlineTag } from "@src/common/blocks/headline-rich-text.block";

const headlineTags = ["h1", "h2", "h3", "h4", "h5", "h6"];

interface DraftJsContent {
    blocks: Array<{ type: string }>;
    entityMap: unknown;
}

interface From {
    eyebrow: unknown;
    headline: { draftContent?: DraftJsContent };
    htmlTag?: string;
}

interface To {
    eyebrow: unknown;
    headline: { draftContent?: DraftJsContent };
}

/**
 * A block's migrations run before those of its child blocks, so the headline is still Draft.js here. The migration writes the tag into
 * the Draft.js type, and the headline's conversion to TipTap turns the type into a text block and a style.
 */
export class MoveHtmlTagIntoHeadlineMigration extends BlockMigration<(from: From) => To> implements BlockMigrationInterface {
    public readonly toVersion = 1;

    protected migrate({ htmlTag, headline, ...from }: From): To {
        if (!headline.draftContent) {
            return { ...from, headline };
        }

        const tag = htmlTag && headlineTags.includes(htmlTag) ? htmlTag : defaultHeadlineTag;
        // An empty headline has no block to carry the tag, so it gets an empty one
        const blocks =
            headline.draftContent.blocks.length > 0
                ? headline.draftContent.blocks
                : [{ key: "empty", type: "header-one", text: "", depth: 0, inlineStyleRanges: [], entityRanges: [], data: {} }];

        return {
            ...from,
            headline: {
                ...headline,
                draftContent: {
                    ...headline.draftContent,
                    blocks: blocks.map((block) => ({ ...block, type: getDraftJsTypeWithHeadlineTag(block.type, tag) })),
                },
            },
        };
    }
}
