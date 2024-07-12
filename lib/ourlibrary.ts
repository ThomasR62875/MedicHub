/*import {Session} from "@supabase/supabase-js";

export interface AllSession {   //La idea es pasar este como session asi no tenes que pedir el id en supabas
    session : Session
    id : string
    dni: string

}

La idea es hacer una libreria de nuestras cosas para no repetir código            */

export const getDate = (date: Date) => {
    return date ? date.toLocaleDateString() : 'Seleccione una fecha';
};



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
