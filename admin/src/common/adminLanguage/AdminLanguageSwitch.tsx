import { SelectField } from "@dextinity/admin";
import { Form, FormSpy } from "react-final-form";
import { FormattedMessage } from "react-intl";

import { useAdminLanguage } from "./AdminLanguageContext";

export function AdminLanguageSwitch() {
    const { language, languages, setLanguage } = useAdminLanguage();

    if (languages.length < 2) {
        return null;
    }

    return (
        <Form initialValues={{ language }} onSubmit={() => {}} subscription={{}}>
            {() => (
                <>
                    <SelectField
                        name="language"
                        label={<FormattedMessage id="adminLanguageSwitch.label" defaultMessage="Admin language" />}
                        // Each language is named in itself, so users who switched to a language they can't read still find their own
                        options={languages.map((language) => ({
                            value: language,
                            label: new Intl.DisplayNames([language], { type: "language" }).of(language) ?? language,
                        }))}
                        required
                        fullWidth
                    />
                    <FormSpy
                        subscription={{ values: true }}
                        onChange={({ values }) => {
                            if (values.language !== language) {
                                setLanguage(values.language);
                            }
                        }}
                    />
                </>
            )}
        </Form>
    );
}
