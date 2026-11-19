import { de, enUS } from "date-fns/locale";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getLanguageConfig } from "./lang";

function stubBrowserLanguages(languages: string[] | undefined, language = "en-US") {
    vi.stubGlobal("navigator", { languages, language });
}

describe("getLanguageConfig", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("uses the first browser language the admin supports", () => {
        stubBrowserLanguages(["fr-FR", "de-AT", "en-US"]);

        const { language, dateFnsLocale } = getLanguageConfig();

        expect(language).toBe("de");
        expect(dateFnsLocale).toBe(de);
    });

    it("matches a regional browser language regardless of its case", () => {
        stubBrowserLanguages(["DE-ch"]);

        expect(getLanguageConfig().language).toBe("de");
    });

    it("falls back to English when the admin supports none of the browser languages", () => {
        stubBrowserLanguages(["fr-FR", "it-IT"]);

        const { language, dateFnsLocale } = getLanguageConfig();

        expect(language).toBe("en");
        expect(dateFnsLocale).toBe(enUS);
    });

    it("uses the single browser language when the browser offers no list", () => {
        stubBrowserLanguages(undefined, "de-DE");

        expect(getLanguageConfig().language).toBe("de");
    });
});
