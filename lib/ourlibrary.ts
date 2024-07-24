/*import {Session} from "@supabase/supabase-js";

export interface AllSession {   //La idea es pasar este como session asi no tenes que pedir el id en supabas
    session : Session
    id : string
    dni: string

}

La idea es hacer una libreria de nuestras cosas para no repetir código            */

import {SexGenderOption} from "./types";
import {t} from "i18next";
import {useTranslation} from "react-i18next";
const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];
export function formatDate(dateString: string | number | Date) {
    const {i18n} = useTranslation();
    const currentLanguage = i18n.language
    const date = new Date(dateString);
    const day = date.getUTCDate();
    if(currentLanguage === 'english'){
        const month = months[date.getMonth()];
        return `${day} of ${month}`;
    }
    else{
        const month = meses[date.getMonth()];
        return `${day} de ${month}`;
    }
}

export function formatDateV2(dateString: string | number | Date) {
    const {i18n} = useTranslation();
    const currentLanguage = i18n.language
    const date = new Date(dateString);
    const day = date.getDate();
    let month : string;
    if(currentLanguage === 'english'){
        const month = months[date.getMonth()];
        return `${day+1} of ${month}`;
    }
    else{
        const month = meses[date.getMonth()];
        return `${day+1} de ${month}`;
    }
}

export const sexGenderOptions: SexGenderOption[] = [
    { name: 'male' },
    { name: 'female' },
    { name: 'non-binary' },
    { name: 'other' },
];

export const validateTextLength= (str:string, length:number): {result:boolean,msg:string} => {
    if (str.length <= length) {
        return {result: true, msg: ``};
      } else {
        return {result: false,msg: t('warn21')};
      }
}