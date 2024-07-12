import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import {
    User,
    DependentUser,
    Appointment,
    Specialty,
    Doctor,
    Medication,
    Advertisement,
    UserData,
    AppointmentInfo
} from './types';

import getEnvVars from '../environment';

const { REACT_APP_SUPABASE_URL, REACT_APP_ANON_KEY } = getEnvVars();

export const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_ANON_KEY, {
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

export const getUserSession = async (auth_id: string): Promise<DependentUser> => {
    const {data, error} = await supabase.rpc('get_independent_user', {auth_id_input: auth_id});
    if (error) {
        console.error('Error inserting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    return data
}

// Obtiene el usuario id del ususario
export const getUserId = async (): Promise<string> => {
    const {data, error} = await supabase.rpc("get_independent_user_id",)
    if (error) {
        console.error('Error inserting UserId data:', error.message);
    } else {
        console.log('UserId data inserted successfully');
    }
    return data;
}

// Crea el usuario

export const signUp = async (user: User, password: string): Promise<{ success: boolean; message?: string }> => {
    const {error} = await supabase.auth.signUp({
        email: user.email,
        password: password,
        options: {
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                dni: user.dni,
                sex: user.sex,
                birthdate: user.birthdate,
                ...user.raw_user_meta_data
            },
        },
    })
    if (error) {
        return {success: false, message: error.message};
    } else {
        return {success: true};
    }

}

// Agrega un appointment recibiendo el appointment como parametro
export const addAppointment = async (appoint: Appointment): Promise<{ success: boolean; message?: string }> => {
    const { error } = await supabase.rpc("add_appointment", {date_input: appoint.date, description_input: appoint.description,
        doctor_input: appoint.doctor, user_id: appoint.user_id, observations_input: appoint.observations});
    if (error) {
        return {success: false, message: error.message};
    } else {
        return {success: true};
    }
};

// Agrega un Doctor recibiendo el doctor como parametro
export const addDoctor = async (doctor: Doctor): Promise<{ success: boolean; message?: string }> => {
    const {error} = await supabase.rpc("add_doctor", {
        name_input: doctor.name,
        specialty_input: doctor.specialty,
        phone_input: doctor.phone,
        email_input: doctor.email,
        addresses_input: doctor.addresses,
        user_id_input: doctor.user_id
    });

    if (error) {
        console.error('Error inserting data:', error.message);
        return {success: false, message: error.message};
    } else {
        console.log('Doctor added successfully');
        return {success: true};
    }
};


//Agrega un dependent user
export const addDependentUser = async (user: DependentUser): Promise<{ success: boolean; message?: string }> =>{
    const { error } = await supabase.rpc("add_dependent_user",{first_name_input: user.first_name,
        last_name_input : user.last_name, dni_input:user.dni, birthdate_input: user.birthdate, sex_input: user.sex});
    if (error) {
        console.error('Error inserting data:', error.message);
        return {success: false, message: error.message};
    } else {
        console.log('DependentUser added successfully');
        return {success: true};
    }
}

//Agregar medication
export const addMedication = async (medication: Medication): Promise<{ success: boolean; message?: string }> => {
    const {error} = await supabase.rpc("add_medication",
        {
            name_input: medication.name,
            prescription_input: medication.prescription,
            since_input: medication.sinceWhen,
            until_input: medication.untilWhen,
            how_often_input: medication.howOften,
            is_forever_input: medication.isForever
        });
    if (error) {
        console.error('Error inserting data:', error.message);
        return {success: false, message: error.message};
    } else {
        console.log('Medication added successfully');
        return {success: true};
    }
}
// Devuelve todos los Doctores por usuario
export const getAllDoctorsByUser = async (session_user_id: String): Promise<Doctor [] | undefined> => {
    const {data, error} = await supabase.rpc('get_all_doctors_by_user', {user_id: session_user_id});
    if (error) {
        console.error('Error inserting doctors data:', error.message);
    } else {
        console.log('Doctors data inserted successfully');
    }

    return data
}

//Obtiene las Especialidades médicas de la tabla
export const getSpecialties = async (): Promise<Specialty[] | undefined> => {

    const {data, error} = await supabase.rpc('get_specialties');
    if (error) {
        console.error('Error getting specialty data:', error.message);
    } else {
        console.log('Specialty data got successfully');
    }
    return data
}

// Obtiene el doctor por su id
export const getDoctor = async (doctor_id: string): Promise<Doctor> => {

    const {data, error} = await supabase.rpc('get_doctor', {doctor_id: doctor_id});
    if (error) {
        console.error('Error getting doctor data:', error.message);
    } else {
        console.log('Doctor data got successfully');
    }
    return data
}

// Obtiene los doctores por el id del usuario
export const getDoctors = async (): Promise<Doctor[] | undefined> => {
    let to_return: Doctor[] = []
    const id: string = await getUserId();
    const {data, error} = await supabase.rpc("get_doctors", {user_id: id});
    if (error) {
        console.error('Error getting doctor data:', error.message);
    } else {
        console.log('Doctor data got successfully');
    }
    data.forEach((doctor: Doctor) => {
        // @ts-ignore
        to_return.push({
            name: doctor.name,
            specialty: doctor.specialty,
            phone: doctor.phone,
            email: doctor.email,
            addresses: doctor.addresses,
            user_id: id,
            id: doctor.id
        });
    });
    return to_return
}

// Devuelve todos los usuarios dependiendo de un user_id incluyendo el usuario independiente
export const getAllUsers = async (session_user_id: String): Promise<DependentUser[] | undefined> => {
    const {data, error} = await supabase.rpc('get_all_users', {user_id: session_user_id});
    if (error) {
        console.error('Error getting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    return data
}

// Devuelve todos los usuarios dependiendo de un user_id
export const getDependentUsers = async (session_user_id: String): Promise<DependentUser[] | undefined> => {
    let to_return: DependentUser[] = []
    const {data, error} = await supabase.rpc('get_dependent_users');
    if (error) {
        console.error('Error getting users data:', error.message);
    } else {
        console.log('Users data inserted successfully');
    }
    if (data) {
        data.forEach((dependent_user: DependentUser) => {
            to_return.push({
                first_name: dependent_user.first_name,
                last_name: dependent_user.last_name,
                dni: dependent_user.dni,
                id: dependent_user.id,
                birthdate: dependent_user.birthdate,
                sex: dependent_user.sex
            })
        });
    }
    return to_return
}

export const getAppointments = async (): Promise<Appointment[] | undefined> => {
    const to_return: Appointment[] = [];
    const user_id = await getUserId();

    const {data, error, status} = await supabase.rpc('get_appointments', {user_id: user_id})
    if (error && status !== 406) {
        throw error
    }

    for (const appoint of data) {
        const user: (DependentUser) = await getUser(appoint.user);
        const doctor: (Doctor) = await getDoctor(appoint.doctor);

        const new_appoint: Appointment = {
            id: appoint.id,
            description: appoint.description,
            date: appoint.date,
            user_name: user.first_name,
            doctor: doctor.id,
            user_id: appoint.user,
            observations: appoint.observations
        }
        to_return.push(new_appoint);

    }
    if (error) {
        console.error('Error inserting specialty data:', error.message);
    } else {
        console.log('Specialty data inserted successfully');
    }
    return to_return
}


function getAge(birthdate: Date | null): number | null {
    if (!birthdate) {
        return null;
    }

    const parsedBirthdate = new Date(birthdate);

    const today = new Date();
    let age = today.getFullYear() - parsedBirthdate.getFullYear();
    const monthDiff = today.getMonth() - parsedBirthdate.getMonth();
    const dayDiff = today.getDate() - parsedBirthdate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}


// Obtiene la informacion para las preguntas
export const getUserData = async (appointment: Appointment): Promise<UserData | null> => {
    const doctor: (Doctor) = await getDoctor(appointment.doctor);

    const { data: lastAppointmentData, error: lastAppointmentError } = await supabase
        .rpc('get_last_appointment_info', { doctor_id_input: appointment.doctor, user_id: appointment.user_id });
    if (lastAppointmentError) {
        console.error('Error getting last appointment data:', lastAppointmentError.message);
        return null;
    }

    const appointmentInfo: AppointmentInfo = {
        specialty: doctor.specialty,
        observations: lastAppointmentData.observations,
        date: lastAppointmentData.date,
        description: lastAppointmentData.description,
    };


    const user: (DependentUser) = await getUser(appointment.user_id);

    return {
        lastAppointment: appointmentInfo,
        medicalInfo: {
            sex: user.sex,
            age: getAge(user.birthdate),
        },
    };
};


// borrar

export const deleteAppointment = async (appoint: Appointment): Promise<{ success: boolean, message: string }> => {
    const {error} = await supabase.rpc('delete_appointment_by_id', {input_id: appoint.id});
    if (error) {
        return {
            success: false,
            message: `Error deleting appointment: ${error.message}`,
        }
    } else {
        return {
            success: true,
            message: 'Appointment user deleted successfully',
        }
    }
}

export const deleteDependentUser = async (user: DependentUser): Promise<{ success: boolean, message: string }> => {
    const {error} = await supabase.rpc('delete_dependent_user_by_id', {input_id: user.id});
    if (error) {
        return {
            success: false,
            message: `Error deleting dependent user: ${error.message}`,
        }
    } else {
        return {
            success: true,
            message: 'Dependent user deleted successfully',
        }
    }
}

export const deleteDoctor = async (doc: Doctor): Promise<{ success: boolean, message: string }> => {
    const {error} = await supabase.rpc('delete_doctor_by_id', {input_id: doc.id});
    if (error) {
        return {
            success: false,
            message: `Error deleting doctor: ${error.message}`,
        }
    } else {
        return {
            success: true,
            message: 'Doctor deleted successfully',
        }
    }
}

export const deleteMedication = async (medication: Medication): Promise<{ success: boolean, message: string }> => {
    const {error} = await supabase.rpc('delete_medication_by_id', {input_id: medication.id});
    if (error) {
        return {
            success: false,
            message: `Error deleting medication: ${error.message}`,
        }
    } else {
        return {
            success: true,
            message: 'Medication deleted successfully',
        }
    }
}


// editar

export const updateAppointment = async (appoint: Appointment): Promise<{ success: boolean, message: string }> => {
    console.log("id: "+ appoint.id +"date: "+ appoint.date +"desc:  "+ appoint.description+"doc:   "+  appoint.doctor+"user:   "+appoint.user_id )
    console.log(appoint.date)
    const { error } = await supabase.rpc("update_appointment", {id_input: appoint.id, date_input: appoint.date, description_input: appoint.description,
        doctor_input: appoint.doctor, user_input: appoint.user_id, observations_input: appoint.observations});
    if (error) {
        return {
            success: false,
            message: 'Error updating appointment data',
        }
    } else {
        return {
            success: true,
            message: 'Dependent appointment successfully',
        }
    }
};

export const updateDependentUser = async (depUser: DependentUser): Promise<{ success: boolean, message: string }> => {
    const { error } = await supabase.rpc("update_user", {id_input: depUser.id , first_name_input: depUser.first_name, last_name_input: depUser.last_name, dni_input: depUser.dni, birthdate_input: depUser.birthdate, sex_input: depUser.sex});
    if (error) {
        return {
            success: false,
            message: 'Error updating dependent user data',
        }
    } else {
        return {
            success: true,
            message: 'Dependent user updated successfully',
        }
    }
};

export const updateDoctor = async (doc: Doctor): Promise<{ success: boolean, message: string }> => {

    const {error} = await supabase.rpc("update_doctor",
        {
            id_input: doc.id,
            email_input: doc.email,
            name_input: doc.name,
            phone_input: doc.phone,
            addresses_input: doc.addresses,
            specialty_input: doc.specialty,
            user_id_input: doc.user_id
        });
    if (error) {
        return {
            success: false,
            message: 'Error updating doctor data',
        }
    } else {
        return {
            success: true,
            message: 'Doctor updated successfully',
        }
    }
};

export const updateMedication = async (medication: Medication): Promise<{ success: boolean, message: string }> => {
    const {error} = await supabase.rpc('update_medication',
        {
            id_input: medication.id,
            name_input: medication.name,
            prescription_input: medication.prescription,
            since_input: medication.sinceWhen,
            until_input: medication.untilWhen,
            how_often_input: medication.howOften,
            is_forever_input: medication.isForever
        });
    if (error) {
        return {
            success: false,
            message: 'Error updating medication data',
        }
    } else {
        return {
            success: true,
            message: 'Medication updated successfully',
        }
    }
};


export async function getMedications(): Promise<Medication[] | undefined> {
    let to_return: Medication[] | undefined = undefined

    const {data: user_id, error: user_data_error} = await supabase.rpc('get_independent_user_id')
    if (user_data_error)
        throw new Error(user_data_error.message);

    const {data, error} = await supabase.rpc("get_all_medications_by_user", {user_id: user_id});
    if (error) {
        throw new Error(error.message);
    }

    to_return = [];
    data.forEach((medication: Medication) => {
        // @ts-ignore
        to_return.push({
            id: medication.id,
            name: medication.name,
            prescription: medication.prescription,
            sinceWhen: medication.sinceWhen,
            untilWhen: medication.untilWhen,
            howOften: medication.howOften,
            isForever: medication.isForever
        });
    });
    return to_return;
}


export const setDependentUser = async (parent_id: string, child_id: string) => {
    const {error: error} = await supabase.rpc('set_dependent_user', {parent: parent_id, child_id: child_id});
    if (error) {
        return {
            success: false,
            message: 'Error setting dependent user'
        }
    } else {
        return {
            success: true,
            message: 'Dependent user associated correctly to another user'
        }
    }
}

export const getUserIdByEmail = async (email_input: string) : Promise<string | undefined> => {
    const {data: user_id ,error: error} = await supabase.rpc('get_independent_user_by_email', {email_input: email_input});
    if (!error) {
        return user_id
    }
    return undefined
}

//Obtiene la informacion necesaria para la publicidad

export const getAdvertisement = async(banner_type: string) : Promise<Advertisement | undefined> =>{
    const{data,error} = await supabase.rpc('get_advertisement',{banner_input: banner_type})

    if(!error){
        return data;
    }
    console.log(error)
    return undefined;
}