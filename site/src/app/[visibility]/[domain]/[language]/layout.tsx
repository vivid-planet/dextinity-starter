import { gql } from "@dextinity/site-nextjs";
import { Footer } from "@src/layout/footer/Footer";
import { footerFragment } from "@src/layout/footer/Footer.fragment";
import { Header } from "@src/layout/header/Header";
import { headerFragment } from "@src/layout/header/Header.fragment";
import { createGraphQLFetch } from "@src/util/graphQLClient";
import { IntlProvider } from "@src/util/IntlProvider";
import { loadMessages } from "@src/util/loadMessages";
import { recursivelyLoadBlockData } from "@src/util/recursivelyLoadBlockData";
import { setNotFoundContext } from "@src/util/ServerContext";
import { getSiteConfigForDomain } from "@src/util/siteConfig";
import type { Metadata } from "next";

import type { GQLLayoutQuery, GQLLayoutQueryVariables } from "./layout.generated";

export default async function Layout({ children, params }: LayoutProps<"/[visibility]/[domain]/[language]">) {
    const { domain, language: languageParam } = await params;
    const siteConfig = getSiteConfigForDomain(domain);

    let language = languageParam;

    if (!siteConfig.scope.languages.includes(language)) {
        language = "en";
    }
    setNotFoundContext({ domain, language });

    const graphQLFetch = createGraphQLFetch();

    const { header, footer } = await graphQLFetch<GQLLayoutQuery, GQLLayoutQueryVariables>(
        gql`
            query Layout($domain: String!, $language: String!) {
                header: mainMenu(scope: { domain: $domain, language: $language }) {
                    ...Header
                }
                footer: footer(scope: { domain: $domain, language: $language }) {
                    ...Footer
                }
            }
            ${headerFragment}
            ${footerFragment}
        `,
        { domain, language },
    );

    if (footer) {
        footer.content = await recursivelyLoadBlockData({
            blockData: footer.content,
            blockType: "FooterContent",
            graphQLFetch,
            fetch,
            scope: { domain, language },
        });
    }

    const messages = await loadMessages(language);
    return (
        <html lang={language}>
            <body>
                {siteConfig.gtmId && (
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${siteConfig.gtmId}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                )}
                <IntlProvider locale={language} messages={messages}>
                    <Header header={header} />
                    {children}
                    {footer && <Footer footer={footer} />}
                </IntlProvider>
            </body>
        </html>
    );
}

export async function generateMetadata({ params }: LayoutProps<"/[visibility]/[domain]/[language]">): Promise<Metadata> {
    const { domain } = await params;
    const siteConfig = getSiteConfigForDomain(domain);

    return {
        metadataBase: new URL(siteConfig.url),
    };
}
