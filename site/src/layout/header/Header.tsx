"use client";
import { Button } from "@src/common/components/Button";
import { SvgUse } from "@src/common/helpers/SvgUse";
import { MobileMenu } from "@src/layout/header/MobileMenu";
import { PageLayout } from "@src/layout/PageLayout";
import Link from "next/link";
import { FormattedMessage, useIntl } from "react-intl";

import { DesktopMenu } from "./DesktopMenu";
import type { GQLHeaderFragment } from "./Header.fragment.generated";
import styles from "./Header.module.scss";

interface Props {
    header: GQLHeaderFragment[];
}
export const Header = ({ header }: Props) => {
    const intl = useIntl();

    return (
        <header>
            <a className={styles.skipLink} href="#mainContent">
                <Button as="span">
                    <FormattedMessage defaultMessage="Skip to main content" id="skipLink.skipToMainContent" />
                </Button>
            </a>
            <a className={styles.skipLink} href="#footer">
                <Button as="span">
                    <FormattedMessage defaultMessage="Skip to footer" id="skipLink.skipToFooter" />
                </Button>
            </a>
            <PageLayout grid>
                <div className={styles.pageLayoutContent}>
                    <nav className={styles.root}>
                        <Link href="/" title={intl.formatMessage({ id: "header.logo.title", defaultMessage: "Dextinity Logo" })}>
                            <SvgUse href="/assets/dextinity-logo.svg#root" />
                        </Link>
                        <DesktopMenu menu={header} />
                        <MobileMenu menu={header} />
                    </nav>
                </div>
            </PageLayout>
        </header>
    );
};
