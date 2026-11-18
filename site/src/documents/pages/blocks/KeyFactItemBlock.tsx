import { hasTipTapRichTextContent, type PropsWithData, renderTipTapRichText, SvgImageBlock, withPreview } from "@dextinity/site-nextjs";
import type { KeyFactsItemBlockData } from "@src/blocks.generated";
import { inlineRichTextNodeMapping } from "@src/common/blocks/inlineRichTextNodeMapping";
import { Typography } from "@src/common/components/Typography";

import styles from "./KeyFactItemBlock.module.scss";

export const KeyFactItemBlock = withPreview(
    ({ data: { icon, fact, label, description } }: PropsWithData<KeyFactsItemBlockData>) => (
        <div className={styles.root}>
            {icon.damFile && (
                // Todo: set className on SvgImageBlock when supported https://github.com/vivid-planet/dextinity/pull/4523
                <div className={styles.icon}>
                    <SvgImageBlock data={icon} width={48} height={48} />
                </div>
            )}
            <Typography variant="headline500" className={styles.fact}>
                {fact}
            </Typography>
            <Typography variant="headline350">{label}</Typography>
            {hasTipTapRichTextContent(description.tipTapContent) && (
                <Typography variant="paragraph200" className={styles.description}>
                    {renderTipTapRichText({ content: description.tipTapContent, nodeMapping: inlineRichTextNodeMapping })}
                </Typography>
            )}
        </div>
    ),
    { label: "Key fact" },
);
