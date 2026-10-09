import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import arLang from "./ar.json";
import "dayjs/locale/ar";
import "dayjs/locale/en";

const resources = {
  ar: {
    translation: arLang,
  },
};

const savedLanguage = localStorage.getItem("language") || "en";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
