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

// Obtiene el usuario id del ususario
export const getUserId= async () : Promise<String> => {
    const {data, error} = await supabase.rpc("get_independent_user_id", {})
    if (error) {
        console.error('Error inserting UserId data:', error.message);
    } else {
        console.log('UserId data inserted successfully');
    }
    return data;
}

// Agrega un appointment recibiendo el appointment como parametro
export const addAppointment = async (appoint: Appointment): Promise<void> => {
    const { error } = await supabase.rpc("add_appointment", {date_input: appoint.date, description_input: appoint.description,
        doctor_input: appoint.doctor, user_id: appoint.user_id});
    if (error) {
        console.error('Error inserting data:', error.message);
    } else {
        console.log('Data inserted successfully');
        Alert.alert("El Turno ya está agregado");
}};

// Agrega un Doctor recibiendo el doctor como parametro
export const addDoctor = async (doctor: Doctor): Promise<void> => {
    const { error } = await supabase.rpc("add_doctor", {name_input: doctor.name, specialty_input: doctor.specialty,
        phone_input: doctor.phone, email_input: doctor.email, addresses_input: doctor.addresses, user_id_input:doctor.id});
    if (error) {
        console.error('Error inserting data:', error.message);
    } else {
        //Alert.alert('El doctor fue agregado', '',
        //[{text: 'Ok', onPress: () => navigation.navigate({name: 'Doctors', params: {session: session}})},]);
}};
export const addDependentUser = async (user:DependentUser): Promise<void> =>{
    const { error } = await supabase.rpc("add_dependent_user",{first_name_input: user.first_name,
        last_name_input : user.last_name, dni_input:user.dni});
    if (error) {
        console.error('Error inserting data:', error.message);
    } else {
        console.log('Data inserted successfully');
        Alert.alert("El Turno ya está agregado");
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
        console.error('Error inserting specialty data:', error.message);
    } else {
        console.log('Specialty data inserted successfully');
    }
    return data
}

// Devuelve todos los usuarios dependiendo de un user_id
export const getAllUsers = async (session_user_id:String) : Promise<DependentUser[] | undefined> => {
    console.log(session_user_id)
    const { data, error } = await supabase.rpc('get_all_users', { user_id: session_user_id });
    if (error) {
        console.error('Error inserting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    return data
}
