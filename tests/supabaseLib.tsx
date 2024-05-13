
import { supabase } from "../lib/supabase";

export type User = {
    first_name: string;
    last_name: string;
    dni: string;
    age: number;
}



export const getUser = async (session_user_id:String) : Promise<User | null> => {
    
    const { data, error } = await supabase.rpc('get_user', { user_id: session_user_id });
    if (error) {
        return null;
    }
    return data
}


export const getAllUsers = async () : Promise<User[] | null> => {
    
    const { data, error } = await supabase.rpc('get_user');
    if (error) {
        return null;
    }
    return data
}
