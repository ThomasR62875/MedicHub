import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Session } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import {Appointment} from "../screens/Appointments";
import {Doctor} from "../screens/Doctors";
import {Alert} from 'react-native'
import { DependentUser } from '../screens/DependentUsers';
import {Specialty} from "../screens/AddDoctor"
import {Medication} from "../screens/Medication"
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

const supabaseUrl = "https://ockjaboenzpwwhzlsvdj.supabase.co";
const supabaseAnonKey ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ja2phYm9lbnpwd3doemxzdmRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI1MDMwNTgsImV4cCI6MjAyODA3OTA1OH0.hqvQbK0ydgz75DszpuZWjfufpxky9qZi21G5qCtm4eE";


export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
//Devuelve usuario por id
export const getUser = async (session_user_id:String) : Promise<DependentUser> => {
    
    const { data, error } = await supabase.rpc('get_user', { user_id: session_user_id });
    if (error) {
        console.error('Error inserting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    return data
}

export const getUserSession = async (auth_id: string) : Promise<DependentUser> => {
    const {data, error} = await supabase.rpc('get_independent_user', {auth_id_input: auth_id});
    if (error) {
        console.error('Error inserting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    return data
}

// Obtiene el usuario id del ususario
export const getUserId= async () : Promise<String> => {
    const {data, error} = await supabase.rpc("get_independent_user_id", )
    if (error) {
        console.error('Error inserting UserId data:', error.message);
    } else {
        console.log('UserId data inserted successfully');
    }
    return data;
}

// Agrega un appointment recibiendo el appointment como parametro
export const addAppointment = async (appoint: Appointment): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.rpc("add_appointment", {date_input: appoint.date, description_input: appoint.description,
        doctor_input: appoint.doctor, user_id: appoint.user_id});
    if (error) {
        console.error('Error inserting data:', error.message);
        return { success: false, message: error.message };
    } else {
        console.log('Appointment added successfully');
        return { success: true };
    }
};

// Agrega un Doctor recibiendo el doctor como parametro
export const addDoctor = async (doctor: Doctor): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.rpc("add_doctor", {
        name_input: doctor.name,
        specialty_input: doctor.specialty,
        phone_input: doctor.phone,
        email_input: doctor.email,
        addresses_input: doctor.addresses,
        user_id_input: doctor.id
    });

    if (error) {
        console.error('Error inserting data:', error.message);
        return { success: false, message: error.message };
    } else {
        console.log('Doctor added successfully');
        return { success: true };
    }
};


//Agrega un dependent user
export const addDependentUser = async (user: DependentUser): Promise<{ success: boolean; message?: string }> =>{
    const { error } = await supabase.rpc("add_dependent_user",{first_name_input: user.first_name,
        last_name_input : user.last_name, dni_input:user.dni});
    if (error) {
        console.error('Error inserting data:', error.message);
        return { success: false, message: error.message };
    } else {
        console.log('DependentUser added successfully');
        return { success: true };
    }
}    

//Agregar medication
export const addMedication = async (medication : Medication) : Promise<{success:boolean; message?:string}> => {
    const { error } = await supabase.rpc("add_medication",{name_input: medication.name,prescription_input: medication.prescription});
    if (error) {
        console.error('Error inserting data:', error.message);
        return { success: false, message: error.message };
    } else {
        console.log('Medication added successfully');
        return { success: true };
    }
}
// Devuelve todos los Doctores por usuario
export const getAllDoctorsByUser = async (session_user_id:String) : Promise <Doctor [] | undefined> => {
        const {data, error} = await supabase.rpc('get_all_doctors_by_user', {user_id: session_user_id});
        if (error) {
            console.error('Error inserting doctors data:', error.message);
        } else {
            console.log('Doctors data inserted successfully');
        }

        return data
}

//Obtiene las Especialidades médicas de la tabla
export const getSpecialties = async () : Promise<Specialty[] | undefined> => {
    
    const { data, error } = await supabase.rpc('get_specialties');
    if (error) {
        console.error('Error getting specialty data:', error.message);
    } else {
        console.log('Specialty data got successfully');
    }
    return data
}

// Obtiene el doctor por su id
export const getDoctor = async (doctor_id : string) : Promise<Doctor> => {
    
    const { data, error } = await supabase.rpc('get_doctor',{id: doctor_id});
    if (error) {
        console.error('Error getting doctor data:', error.message);
    } else {
        console.log('Doctor data got successfully');
    }
    return data
}

// Devuelve todos los usuarios dependiendo de un user_id
export const getAllUsers = async (session_user_id:String) : Promise<DependentUser[] | undefined> => {
    console.log(session_user_id)
    const { data, error } = await supabase.rpc('get_all_users', { user_id: session_user_id });
    if (error) {
        console.error('Error getting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    return data
}


export const getAppointments = async () : Promise<Appointment[] | undefined> => {
    const to_return: Appointment[] = [];
    const user_id = await getUserId();

    const {data, error, status} = await supabase.rpc('get_appointments', {user_id: user_id})
    if (error && status !== 406) {
        throw error
    }

    for (const appoint of data)  {
        const user: (DependentUser) = await getUser(appoint.user);
        const doctor: (Doctor) = await getDoctor(appoint.doctor);

        const new_appoint:Appointment =  {description: appoint.description,
            date: appoint.date,
            user_name: user.first_name, // Suponiendo que name es el campo que quieres agregar
            doctor: doctor && doctor.name ? doctor.name.concat(" (especialidad: ").concat(doctor.specialty).concat(")") : 'Sin datos de doctor',
            user_id: appoint.user,}
        to_return.push(new_appoint);

    };
    if (error) {
        console.error('Error inserting specialty data:', error.message);
    } else {
        console.log('Specialty data inserted successfully');
    }
    return to_return
}
