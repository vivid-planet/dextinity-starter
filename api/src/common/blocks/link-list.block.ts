import { createListBlock } from "@dextinity/cms-api";

import { TextLinkBlock } from "./text-link.block";

export const LinkListBlock = createListBlock({ block: TextLinkBlock }, "LinkList");
