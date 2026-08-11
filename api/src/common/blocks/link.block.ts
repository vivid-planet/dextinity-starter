import { createLinkBlock, DamFileDownloadLinkBlock, EmailLinkBlock, ExternalLinkBlock, InternalLinkBlock, PhoneLinkBlock } from "@dextinity/cms-api";

export const LinkBlock = createLinkBlock({
    supportedBlocks: {
        internal: InternalLinkBlock,
        external: ExternalLinkBlock,
        damFileDownload: DamFileDownloadLinkBlock,
        email: EmailLinkBlock,
        phone: PhoneLinkBlock,
    },
});
