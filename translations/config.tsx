import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, es } from "../translations";


//https://www.youtube.com/watch?v=lSsbu0peV0U

const resources = {
    en: {
        translation: en,
    },
    es: {
        translation: es,
    },
}

i18next.use(initReactI18next).init({
    debug: true,
    compatibilityJSON: 'v3',
    lng: 'es',
    fallbackLng: 'es',
    interpolation: {
        escapeValue: false,
    },
    resources : resources,
})

export default i18next;