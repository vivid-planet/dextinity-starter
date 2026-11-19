import { MockedProvider, type MockedResponse } from "@apollo/client/testing";
import { ContentScopeProvider, CurrentUserContext, type CurrentUserInterface } from "@dextinity/cms-admin";
import { renderAdmin } from "@src/testing/renderAdmin";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LatestContentUpdates, latestContentUpdatesQuery } from "./LatestContentUpdates";

const currentUser = {
    id: "user-1",
    name: "Editor",
    email: "editor@example.com",
    impersonated: false,
    authenticatedUser: null,
    permissions: [],
    allowedContentScopes: [{ scope: { domain: "main", language: "en" }, label: { domain: "Main", language: "English" } }],
} as CurrentUserInterface;

const latestContentUpdatesMock: MockedResponse = {
    request: { query: latestContentUpdatesQuery, variables: { scope: { domain: "main", language: "en" } } },
    result: {
        data: {
            paginatedPageTreeNodes: {
                __typename: "PaginatedPageTreeNodes",
                nodes: [
                    {
                        __typename: "PageTreeNode",
                        id: "node-1",
                        updatedAt: "2026-11-19T08:00:00.000Z",
                        name: "Home",
                        path: "/",
                        scope: { __typename: "PageTreeNodeScope", domain: "main", language: "en" },
                        category: "mainNavigation",
                    },
                ],
                totalCount: 1,
            },
        },
    },
};

describe("LatestContentUpdates", () => {
    it("links a page to its edit page in the page tree of its category", async () => {
        renderAdmin(
            <MockedProvider mocks={[latestContentUpdatesMock]}>
                <CurrentUserContext.Provider value={{ currentUser, isAllowed: () => true }}>
                    <ContentScopeProvider>{() => <LatestContentUpdates />}</ContentScopeProvider>
                </CurrentUserContext.Provider>
            </MockedProvider>,
            { route: "/main/en/dashboard" },
        );

        const row = await screen.findByRole("row", { name: /Home/ });
        expect(within(row).getByRole("link")).toHaveAttribute("href", "/main/en/pages/pagetree/main-navigation/node-1/edit");
    });
});
