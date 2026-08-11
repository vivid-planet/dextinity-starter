import { gql } from "@dextinity/site-nextjs";
import { mobileMenuFragment } from "@src/layout/header/MobileMenu.fragment";

import { desktopMenuFragment } from "./DesktopMenu.fragment";
import { pageLinkFragment } from "./PageLink.fragment";

export const headerFragment = gql`
    fragment Header on PageTreeNode {
        ...DesktopMenu
        ...MobileMenu
    }
    ${pageLinkFragment}
    ${desktopMenuFragment}
    ${mobileMenuFragment}
`;
