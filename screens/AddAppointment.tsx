import {useEffect, useState} from 'react'
import { supabase } from '../lib/supabase'
import { SafeAreaView,StyleSheet,Alert } from 'react-native'
import {Input} from "react-native-elements";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Appointment} from "./Appointments";
import {DependentUser} from "./DependentUsers"
import {Doctor} from "./Doctors";

type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>

interface Appointment {
    date: Date;
    description: string;
    doctor: string;
    user_id: string;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [date, setDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [doctor, setDoctor] = useState(null)
    const [user_id, setUserId] = useState('')
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>(undefined)
    const [doctors,setDoctors]= useState<Doctor[] | undefined>(undefined)

    // FUNCION PRECARIA PARA QUE DE MOMENTO FUNCIONE CON EL ID DEL PADRE; DEPUES CON EL PICKER ELEGIR QUE USUARIO SE VE

    useEffect(() => {
        if (session) {
            const fetchUserId = async () => {
                try {
                    const { data, error } = await supabase.rpc("get_independent_user_id", {})
                    if (error) {
                        throw error;
                    }
                    if (data) {
                        setUserId(data);
                    }
                } catch (error) {
                    console.error('Error fetching user id:', error);
                }
            };
            fetchUserId();
        }
    }, [session]);


    // ACA ARRAY DE DOCTORES PARA ELEGIR EN EL PICKER
    useEffect(() => {
        if (session) {
            const getAllDoctorsByUser = async () => {
                try {
                    const { data, error } = await supabase.rpc('get_all_doctors_by_user', { user_id: user_id });
                    if (error) {
                        throw error;
                    }
                    if (data) {
                        setDoctors(data);
                    }
                } catch (error) {
                    console.error('Error fetching user id:', error);
                }
            };
            getAllDoctorsByUser();
        }
    }, [session, user_id]); // Agregar user_id como dependencia para que useEffect se ejecute cuando user_id cambie

    // ACA ARRAY DE USERS PARA ELEGIR EN EL PICKER
    useEffect(() => {
        if (session) {
            const getAllUsers = async () => {
                try {
                    const { data, error } = await supabase.rpc('get_all_users', { user_id: user_id });
                    if (error) {
                        throw error;
                    }
                    if (data) {
                        setAllUsers(data);
                    }
                } catch (error) {
                    console.error('Error fetching user id:', error);
                }
            };
            getAllUsers();
        }
    }, [session, user_id]); // Agregar user_id como dependencia para que useEffect se ejecute cuando user_id cambie



    async function addAppointment({
        date,
        description,
        doctor,
        user_id,
    }:Appointment) {
        try {
            const { error } = await supabase.rpc("add_appointment", {date_input: date, description_input: description,doctor_input: doctor, user_id: user_id})
            if (error) {
                console.error('Error inserting data:', error.message);
            } else {
                console.log('Data inserted successfully');
            }
        } catch (error) {
            // @ts-ignore
            console.error('An error occurred:', error.message);
        }finally{
            Alert.alert("El Turno ya está agregado")
        }
        // setLoading(true)
        // if (!session?.user) throw new Error('No user on the session!')
        //
        // const { data, error } = await supabase
        // .from('appointment')
        // .insert([
        // { date: date, description: description, user: session?.user.id},
        // ])
        // .select()
        //
        // if (error) Alert.alert(error.message)
        // else (Alert.alert("El turno ya está cargado"))
        // setLoading(false)
    }

    return (
        <SafeAreaView style={styles.container}>
          {/* Date Picker */}
          <DateTimePicker
            mode="single"
            date={date}
            onChange={(params: Appointment) => setDate(params.date)}
            displayFullDays
            // style={styles.datePicker}
          />
        
          {/* Description Input */}
          {/*multiline={true}
         numberOfLines={4}*/}
            <Input
                leftIcon={{ type: 'font-awesome', name: 'paperclip' }}
                style={styles.verticallySpaced}
                placeholder="Enter description"
                value={description}
                onChangeText={(text) => setDescription(text)}
            />

            {/* Confirm Button */}
            <StandardGreenButton
                title="Confirmar"
                disabled={loading}
                onPress={() => addAppointment({date, description, doctor, user_id})}
            />
        </SafeAreaView>
      );
}

export default AddAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    datePicker: {
        height: '20',
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    }
});