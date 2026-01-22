import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("./public/locales/en/translation.json"),
    }
  },
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language if the translation is missing
  interpolation: {
    escapeValue: false, // React already escapes values
  },
});

export default i18next;
