import { ContentScopeControls, Header, UserHeaderItem } from "@dextinity/cms-admin";

export function MasterHeader() {
    return (
        <Header>
            <ContentScopeControls />
            <UserHeaderItem />
        </Header>
    );
}
