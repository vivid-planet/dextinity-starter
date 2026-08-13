import { Assets, Dashboard, PageTree, Snips, Wrench } from "@dextinity/admin-icons";
import {
    ContentScopeIndicator,
    createRedirectsPage,
    DamPage,
    type DocumentInterface,
    MasterMenu,
    type MasterMenuData,
    PagesPage,
    UserPermissionsPage,
    WarningsPage,
} from "@dextinity/cms-admin";
import { DashboardPage } from "@src/dashboard/DashboardPage";
import { Link } from "@src/documents/links/Link";
import { Page } from "@src/documents/pages/Page";
import { EditFooterPage } from "@src/footers/EditFooterPage";
import { FormattedMessage } from "react-intl";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const pageTreeDocumentTypes: Record<string, DocumentInterface<any, any>> = {
    Page,
    Link,
};
const RedirectsPage = createRedirectsPage({});

export const masterMenuData: MasterMenuData = [
    {
        type: "route",
        primary: <FormattedMessage id="menu.dashboard" defaultMessage="Dashboard" />,
        icon: <Dashboard />,
        route: {
            path: "/dashboard",
            component: DashboardPage,
        },
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.pageTree" defaultMessage="Page tree" />,
        icon: <PageTree />,
        route: {
            path: "/pages/pagetree/main-navigation",
            render: () => (
                <PagesPage
                    path="/pages/pagetree/main-navigation"
                    documentTypes={pageTreeDocumentTypes}
                    category="mainNavigation"
                    renderContentScopeIndicator={(scope) => <ContentScopeIndicator scope={scope} />}
                />
            ),
        },
        requiredPermission: "pageTree",
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.dam" defaultMessage="Assets" />,
        icon: <Assets />,
        route: {
            path: "/assets",
            component: DamPage,
        },
        requiredPermission: "dam",
    },
    {
        type: "collapsible",
        primary: <FormattedMessage id="menu.project-snips" defaultMessage="Project Snips" />,
        icon: <Snips />,
        items: [
            {
                type: "route",
                primary: <FormattedMessage id="menu.project-snips.footer" defaultMessage="Footer" />,
                route: {
                    path: "/project-snips/footer",
                    component: EditFooterPage,
                },
                requiredPermission: "pageTree",
            },
        ],
        requiredPermission: "pageTree",
    },
    {
        type: "route",
        primary: <FormattedMessage id="menu.userPermissions" defaultMessage="User Permissions" />,
        icon: <Snips />,
        route: {
            path: "/user-permissions",
            component: UserPermissionsPage,
        },
        requiredPermission: ["userPermissions", "impersonation"],
    },
    {
        type: "collapsible",
        primary: <FormattedMessage id="menu.system" defaultMessage="System" />,
        icon: <Wrench />,
        items: [
            {
                type: "route",
                primary: <FormattedMessage id="menu.redirects" defaultMessage="Redirects" />,
                route: {
                    path: "/system/redirects",
                    component: RedirectsPage,
                },
                requiredPermission: "pageTree",
            },
            {
                type: "route",
                primary: <FormattedMessage id="menu.warnings" defaultMessage="Warnings" />,
                route: {
                    path: "/system/warnings",
                    component: WarningsPage,
                },
                requiredPermission: "warnings",
            },
        ],
        requiredPermission: "pageTree",
    },
];

export const AppMasterMenu = () => <MasterMenu menu={masterMenuData} />;
