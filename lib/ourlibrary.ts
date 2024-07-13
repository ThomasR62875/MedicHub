/*import {Session} from "@supabase/supabase-js";

export interface AllSession {   //La idea es pasar este como session asi no tenes que pedir el id en supabas
    session : Session
    id : string
    dni: string

}

La idea es hacer una libreria de nuestras cosas para no repetir código            */

import {SexGenderOption} from "./types";
import {t} from "i18next";

export function formatDate(dateString: string | number | Date) {
    const months = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const date = new Date(dateString);
    const day = date.getDate();
    const month = months[date.getMonth()];
    return `${day+1} de ${month}`;
}

export const sexGenderOptions: SexGenderOption[] = [
    { sex_gender_name: t('male'), value: 'male' },
    { sex_gender_name: t('female'), value: 'female' },
    { sex_gender_name: t('non-binary'), value: 'non-binary' },
    { sex_gender_name: t('other'), value: 'other' },
];

export const getSexGenderName = (value: string) => {
    if(value == null)
        return ''
    const option = sexGenderOptions.find(option => option.value === value);
    return option ? option.sex_gender_name : '';
};