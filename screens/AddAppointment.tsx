import React, {useEffect, useState} from 'react'
import { supabase } from '../lib/supabase'
import {SafeAreaView, StyleSheet, Alert, View, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {Input} from "react-native-elements";
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Appointment} from "./Appointments";
import {DependentUser} from "./DependentUsers"
import Doctors, {Doctor} from "./Doctors";
import {Picker} from '@react-native-picker/picker'
import RNPickerSelect from 'react-native-picker-select';
import DatePicker, { getFormatedDate } from 'react-native-modern-datepicker';

type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>


const AddAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [date, setDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [doctor, setDoctor] = useState('')
    const [user_id, setUserId] = useState('')
    const [session_user_id, setSessionUserId] = useState('')
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>(undefined)
    const [doctors, setDoctors] = useState<Doctor[] | undefined>(undefined)

    // FUNCION PRECARIA PARA QUE DE MOMENTO FUNCIONE CON EL ID DEL PADRE; DEPUES CON EL PICKER ELEGIR QUE USUARIO SE VE

    useEffect(() => {
        if (session) {
            const fetchUserId = async () => {
                try {
                    const {data, error} = await supabase.rpc("get_independent_user_id", {})
                    if (data) {
                        setSessionUserId(data);
                    }
                    if (error) {
                        console.error('Error inserting UserId data:', error.message);
                    } else {
                        console.log('UserId data inserted successfully');
                    }

                } catch (error) {
                    console.error('Error fetching UserId data:');
                }
            };
            fetchUserId();

        }
    }, [session]); // Dependencia de sesión para ejecutar solo cuando la sesión cambie

    useEffect(() => {
        if (session_user_id) {
            getAllDoctorsByUser();
            getAllUsers();
        }
    }, [session_user_id]);

    async function getAllDoctorsByUser() {
        try {

            const {data, error} = await supabase.rpc('get_all_doctors_by_user', {user_id: session_user_id});
            setDoctors(data);
            if (error) {
                console.error('Error inserting doctors data:', error.message);
            } else {
                console.log('Doctors data inserted successfully');
            }
        } catch (error) {
            console.error('Error fetching doctors data:');
        }

    }

    async function getAllUsers(){
        try {
            const { data, error } = await supabase.rpc('get_all_users', { user_id: session_user_id });
            setAllUsers(data);
            if (error) {
                console.error('Error inserting users data:', error.message);
            } else {
                console.log('Users data inserted successfully');
            }
        } catch (error) {
            console.error('Error fetching users data:');
        }

    }

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <DatePicker
                    locale={'ES'}
                    options={{
                        textHeaderColor: '#073A29',
                        textDefaultColor: '#000000',
                        selectedTextColor: '#fff',
                        mainColor: '#073A29',
                        textSecondaryColor: '#B5DCCA',
                        borderColor: 'rgba(122, 146, 165, 0.1)',
                    }}
                    // date={date}
                    // onSelectedChange={(date: React.SetStateAction<dayjs.Dayjs>) => setDate(date)}
                />

                <Input
                    leftIcon={{ type: 'font-awesome', name: 'book' }}
                    style={styles.verticallySpaced}
                    placeholder="Título"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                />
                <View style={styles.pickerStyle}>
                    <RNPickerSelect
                        placeholder={{ label: 'Médico', value: null }}
                        items={doctors ? doctors.map(d => ({ label: d.name, value: d.id})) : []}
                        onValueChange={(value) => setDoctor(value)}
                        style={{ ...pickerSelectStyles }}
                        value={doctor}
                    />
                </View>
                <View style={styles.pickerStyle}>
                    <RNPickerSelect
                        placeholder={{ label: 'Usuario', value: null }}
                        items={all_users ? all_users.map(u => ({ label: u.first_name, value: u.id})) : []}
                        onValueChange={(value) => setUserId(value)}
                        style={{ ...pickerSelectStyles }}
                        value={user_id}
                    />
                </View>

                {/* Confirm Button */}
                <StandardGreenButton
                    title="Confirmar"
                    disabled={loading}
                    // onPress={() => addAppointment({date, description, doctor, user_id})}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
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
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
    pickerStyle: {
        marginBottom: 20,
    }
});

// Define pickerSelectStyles at the bottom
const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});