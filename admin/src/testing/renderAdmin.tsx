import { MuiThemeProvider, RouterMemoryRouter } from "@dextinity/admin";
import { DextinityConfigProvider } from "@dextinity/cms-admin";
import { createTheme } from "@src/theme";
import { render, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { IntlProvider } from "react-intl";

const theme = createTheme([]);

/**
 * Renders an admin component under the intl context, the project theme, the router of `App.tsx`, and a Dextinity config
 * with placeholder URLs. The intl context carries no catalog, so every message resolves to its `defaultMessage`.
 *
 * `useCurrentUser` throws without its provider and says so. `useContentScope` does not: without a `ContentScopeProvider`,
 * it matches the default path `/` and returns an empty scope. A test that depends on the scope wraps its tree in
 * `ContentScopeProvider`.
 */
export function renderAdmin(ui: ReactElement, { route = "/" }: { route?: string } = {}): RenderResult {
    return render(
        <DextinityConfigProvider apiUrl="http://admin.test/api" graphQLApiUrl="http://admin.test/api/graphql" adminUrl="http://admin.test">
            <IntlProvider locale="en">
                <MuiThemeProvider theme={theme}>
                    <RouterMemoryRouter initialEntries={[route]}>{ui}</RouterMemoryRouter>
                </MuiThemeProvider>
            </IntlProvider>
        </DextinityConfigProvider>,
    );
}
