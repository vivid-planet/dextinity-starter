import { gql } from "@apollo/client";
import { Link as LinkIcon } from "@dextinity/admin-icons";
import { createDocumentDependencyMethods, createDocumentRootBlocksMethods, type DependencyInterface, type DocumentInterface } from "@dextinity/cms-admin";
import { LinkBlock } from "@src/common/blocks/LinkBlock";
import type { GQLLink, GQLLinkInput } from "@src/graphql.generated";
import { categoryToUrlParam } from "@src/pageTree/pageTreeCategories";
import { FormattedMessage } from "react-intl";

import { EditLink } from "./EditLink";

const rootBlocks = {
    content: LinkBlock,
};

export const Link: DocumentInterface<Pick<GQLLink, "content">, GQLLinkInput> & DependencyInterface = {
    displayName: <FormattedMessage id="generic.link" defaultMessage="Link" />,
    editComponent: EditLink,
    menuIcon: LinkIcon,
    getQuery: gql`
        query LinkDocument($id: ID!) {
            page: pageTreeNode(id: $id) {
                id
                name
                slug
                parentId
                document {
                    __typename
                    ... on DocumentInterface {
                        id
                        updatedAt
                    }
                    ... on Link {
                        content
                    }
                }
            }
        }
    `,
    updateMutation: gql`
        mutation UpdateLink($pageId: ID!, $input: LinkInput!, $lastUpdatedAt: DateTime, $attachedPageTreeNodeId: ID) {
            saveLink(id: $pageId, input: $input, lastUpdatedAt: $lastUpdatedAt, attachedPageTreeNodeId: $attachedPageTreeNodeId) {
                id
                content
                updatedAt
            }
        }
    `,
    ...createDocumentRootBlocksMethods(rootBlocks),
    ...createDocumentDependencyMethods({
        rootQueryName: "link",
        rootBlocks,
        basePath: ({ pageTreeNode }) => `/pages/pagetree/${categoryToUrlParam(pageTreeNode.category)}/${pageTreeNode.id}/edit`,
    }),
};
