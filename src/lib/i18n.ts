import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/locales/en.json";
import ru from "@/locales/ru.json";
import uk from "@/locales/uk.json";
import kz from "@/locales/kz.json";
import cz from "@/locales/cz.json";

const resources = {
  en: {
    translation: en
  },
  ru: {
    translation: ru
  },
  uk: {
    translation: uk
  },
  kz: {
    translation: kz
  },
  cz: {
    translation: cz
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['en', 'ru', 'uk', 'kz', 'cz'],
    lng: "en",
    fallbackLng: "en",
  }).then();

export default i18n;
