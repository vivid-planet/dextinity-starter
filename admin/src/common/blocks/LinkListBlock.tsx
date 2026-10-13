import { createListBlock } from "@dextinity/cms-admin";
import { TextLinkBlock } from "@src/common/blocks/TextLinkBlock";

export const LinkListBlock = createListBlock({ name: "LinkList", block: TextLinkBlock });
