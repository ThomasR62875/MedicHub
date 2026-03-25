import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, es } from "../translations";


//https://www.youtube.com/watch?v=lSsbu0peV0U

const resources = {
    español: {
        translation: es,
    },
    english: {
        translation: en,
    },
}
export default resources;

i18next.use(initReactI18next).init({
    debug: true,
    compatibilityJSON: 'v3',
    lng: 'español',
    fallbackLng: 'español',
    interpolation: {
        escapeValue: false,
    },
    resources : resources,
})
