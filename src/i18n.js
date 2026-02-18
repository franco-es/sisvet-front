import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import es from "./locales/es.json";
import en from "./locales/en.json";
import pt from "./locales/pt.json";

const resources = {
  es: { translation: es },
  en: { translation: en },
  pt: { translation: pt },
};

// Map browser codes to our supported languages
const supportedLngs = ["es", "en", "pt"];
const fallbackLng = "es";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs,
    fallbackLng,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "sisvet_lang",
    },
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
