import { ContentScopeControls, Header, UserHeaderItem } from "@dextinity/cms-admin";

import { AdminLanguageSwitch } from "./adminLanguage/AdminLanguageSwitch";

export function MasterHeader() {
    return (
        <Header>
            <ContentScopeControls />
            <UserHeaderItem>
                <AdminLanguageSwitch />
            </UserHeaderItem>
        </Header>
    );
}
