import { de, enUS } from "date-fns/locale";
import { afterEach, describe, expect, it, vi } from "vitest";

import { getClosestSupportedLanguageFromBrowserLanguages, getLanguageConfig, isSupportedLanguage } from "./lang";

function stubBrowserLanguages(languages: string[] | undefined, language = "en-US") {
    vi.stubGlobal("navigator", { languages, language });
}

describe("getClosestSupportedLanguageFromBrowserLanguages", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("uses the first browser language the admin supports", () => {
        stubBrowserLanguages(["fr-FR", "de-AT", "en-US"]);

        expect(getClosestSupportedLanguageFromBrowserLanguages()).toBe("de");
    });

    it("matches a regional browser language regardless of its case", () => {
        stubBrowserLanguages(["DE-ch"]);

        expect(getClosestSupportedLanguageFromBrowserLanguages()).toBe("de");
    });

    it("falls back to English when the admin supports none of the browser languages", () => {
        stubBrowserLanguages(["fr-FR", "it-IT"]);

        expect(getClosestSupportedLanguageFromBrowserLanguages()).toBe("en");
    });

    it("uses the single browser language when the browser offers no list", () => {
        stubBrowserLanguages(undefined, "de-DE");

        expect(getClosestSupportedLanguageFromBrowserLanguages()).toBe("de");
    });
});

describe("isSupportedLanguage", () => {
    it("accepts a supported language", () => {
        expect(isSupportedLanguage("de")).toBe(true);
    });

    it("rejects an unsupported language and a missing choice", () => {
        expect(isSupportedLanguage("fr")).toBe(false);
        expect(isSupportedLanguage(null)).toBe(false);
    });
});

describe("getLanguageConfig", () => {
    it("resolves the date-fns locale of the given language", () => {
        expect(getLanguageConfig("de").dateFnsLocale).toBe(de);
        expect(getLanguageConfig("en").dateFnsLocale).toBe(enUS);
    });
});
