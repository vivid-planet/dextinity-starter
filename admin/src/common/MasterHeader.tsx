import { ContentScopeControls, Header, UserHeaderItem } from "@dextinity/cms-admin";

import { useAdminLanguage } from "./adminLanguage/AdminLanguageContext";
import { AdminLanguageSwitch } from "./adminLanguage/AdminLanguageSwitch";

export function MasterHeader() {
    const { language, languages, setLanguage } = useAdminLanguage();

    return (
        <Header>
            <ContentScopeControls />
            <UserHeaderItem>
                {languages.length > 1 && <AdminLanguageSwitch languages={languages} value={language} onChange={setLanguage} />}
            </UserHeaderItem>
        </Header>
    );
}
