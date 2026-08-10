import type { AllCategories } from "@dextinity/cms-admin";
import type { GQLPageTreeNodeCategory } from "@src/graphql.generated";
import { kebabCase } from "change-case";
import { FormattedMessage } from "react-intl";

export const pageTreeCategories: AllCategories = [
    {
        category: "mainNavigation",
        label: <FormattedMessage id="menu.pageTree.mainNavigation" defaultMessage="Main navigation" />,
    },
];

export function categoryToUrlParam(category: GQLPageTreeNodeCategory | string): string {
    return kebabCase(category);
}
