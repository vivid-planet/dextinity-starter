import { gql } from "@dextinity/site-nextjs";

export const desktopMenuFragment = gql`
    fragment DesktopMenu on PageTreeNode {
        id
        name
        hideInMenu
        ...PageLink
        childNodes {
            id
            name
            hideInMenu
            ...PageLink
        }
    }
`;
