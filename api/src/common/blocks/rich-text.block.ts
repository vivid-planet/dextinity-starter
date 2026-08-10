import { createRichTextBlock } from "@dextinity/cms-api";
import { LinkBlock } from "@src/common/blocks/link.block";

export const RichTextBlock = createRichTextBlock({ link: LinkBlock });
