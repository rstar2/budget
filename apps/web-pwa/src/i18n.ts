import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const englishLang = "en";

const allowedLanguages = [englishLang /*, "bg" , "pl" */] as const;

i18n.use(initReactI18next).init({
    // the translations
    // (tip move them in a JSON file and import them (statically or on demand)
    resources: {
        en: {
            // only a single namespace
            translation: {
                title: "Budget",
                loading: "Loading ...",
                action: {
                    login: "Login",
                    logout: "Logout",
                    add: "Add",
                },
                label: {
                    auth: {
                        email: "Email",
                        password: "Password",
                    },
                    expense: {
                        amount: "Money",
                        type: "Type",
                    },

                    all: "All",

                    type: {
                        food: "Food",
                        house: "House",
                        car: "Car",
                        Maya: "Maya",
                        Rumen: "Rumen",
                        Kasia: "Kasia",
                        pleasure: "Pleasure",
                        other: "Other",
                    },
                },
                error: {
                    email: {
                        invalid: "Must be valid email",
                    },
                    password: {
                        min: "Must be at least {{min}} characters long",
                        max: "Must be less than {{max}} characters long",
                    },

                    amount: {
                        required: "Required",
                        min: "Must be at least {{min}} levs",
                        max: "Must be less than {{max}} levs",
                    },
                },
            },
        },
    },
    lng: englishLang, // if you're using a language detector, do not define the lng option

    fallbackLng: englishLang,

    react: {
        transSupportBasicHtmlNodes: true,
    },

    interpolation: {
        escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },

    // if using a language detector plugin that detects region specific languages,
    // this can remove region the "en-US"
    // load: "languageOnly",

    // debug: true
});

type LanguageDict = { [key: string]: string | LanguageDict };

const i18nUtil = {
    /**
     * The set of languages known to be present in the server
     */
    allowedLanguages,

    /**
     * Change current language
     */
    changeLanguage(lang: string) {
        i18n.changeLanguage(lang);
    },

    /**
     * Add a language bundle
     */
    addLanguage(lang: string, dictionary: LanguageDict) {
        i18n.addResourceBundle(lang, "translation", dictionary);
    },

    /**
     * Check if language is valid, e.g. among the added bundles
     */
    isValidLanguage(lang: string): boolean {
        return i18n.hasResourceBundle(lang.toLowerCase(), "translation");
    },

    /**
     * Return the currently set and used language
     */
    get currentLanguage(): string {
        return i18n.language;
    },

    /**
     * Re-export the t function
     */
    t: i18n.t,
};

/**
 * Export as common utils
 */
export default i18nUtil;
