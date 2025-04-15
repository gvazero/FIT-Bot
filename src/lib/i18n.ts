/**
 * Internationalization (i18n) configuration
 * 
 * This is the set-up for i18next library for handling multiple languages in the application.
 * It imports translation files for all supported languages and configures the i18n instance.
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import uk from "@/locales/uk.json";
import kz from "@/locales/kz.json";
import cz from "@/locales/cz.json";

/**
 * Resources object containing all translation files
 */
const resources = {
  en: {
    translation: en  // English translations
  },
  ru: {
    translation: ru  // Russian translations
  },
  uk: {
    translation: uk  // Ukrainian translations
  },
  kz: {
    translation: kz  // Kazakh translations
  },
  cz: {
    translation: cz  // Czech translations
  }
};

// Initialize i18next with React integration
i18n
  .use(initReactI18next)  // Passes i18n down to react-i18next
  .init({
    resources,
    supportedLngs: ['en', 'ru', 'uk', 'kz', 'cz'],  // List of supported languages
    lng: "en",  // Default language
    fallbackLng: "en",  // Fallback language if translation is missing
  }).then();

export default i18n;
