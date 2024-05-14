import React, {useEffect, useState} from 'react'
import { addAppointment, getAllDoctorsByUser, getAllUsers, getUserId } from '../lib/supabase'
import {SafeAreaView, StyleSheet, Alert, View, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {Input} from "react-native-elements";
import dayjs from 'dayjs';
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Appointment} from "./Appointments";
import {DependentUser} from "./DependentUsers"
import {Doctor} from "./Doctors";
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-modern-datepicker';

type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>


const AddAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [date, setDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [doctor, setDoctor] = useState('')
    const [user_id, setUserId] = useState('')
    const [session_user_id, setSessionUserId] = useState('')
    const [all_users, setAllUsers] = useState<DependentUser[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])

    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const validateDescription = (value: string) => {
        if (value.trim() === '') {
            setDescriptionErrorMessage('Debe ingresar la descripción del turno.');
        } else {
            setDescriptionErrorMessage('');
        }
    };

    useEffect(() => {
        if (session) {
            async function fetchUserId() {
                setSessionUserId(await getUserId());
            };
            fetchUserId();

        }
    }, [session]); // Dependencia de sesión para ejecutar solo cuando la sesión cambie

    useEffect(() => {
        if (session_user_id) {
            async function getInfo() {
                setDoctors(await getAllDoctorsByUser(session_user_id));
                setAllUsers(await getAllUsers(session_user_id));
            }
            getInfo()
        }
    }, [session_user_id]);

    const doctorsList = doctors ? (doctors as Doctor[]).map((doctor: Doctor) => ({
        label: doctor.name,
        value: doctor.id,
    })): [];

    const userList = all_users ? (all_users as DependentUser[]).map((user: DependentUser) => ({
        label: user.first_name,
        value: user.id,
    })): [];
    return (
        <View style={styles.containerTotal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={styles.container}>
                <DatePicker
                    locale={'ES'}
                    options={{
                        mainColor: '#000',
                        textSecondaryColor: '#000',
                        borderColor: '#000',
                        backgroundColor: '#e9f4e9',
                    }}
                    // date={date}
                    // onSelectedChange={(date: React.SetStateAction<dayjs.Dayjs>) => setDate(date)}
                />
                <Input
                    leftIcon={{ type: 'font-awesome', name: 'book' }}
                    style={styles.verticallySpaced}
                    placeholder="Descripción"
                    value={description}
                    onChangeText={(text) => {
                        setDescription(text);
                        validateDescription(text);
                    }}
                    errorStyle={{ color: 'red' }}
                    errorMessage={descriptionErrorMessage}
                />
                <View style={styles.pickerStyle}>
                    <RNPickerSelect
                        placeholder={{ label: 'Médico', value: null }}
                        items={doctorsList}
                        onValueChange={(value) => setDoctor(value)}
                        style={{ ...pickerSelectStyles }}
                        value={doctor}
                    />
                </View>
                <View style={styles.pickerStyle}>
                    <RNPickerSelect
                        placeholder={{ label: 'Usuario', value: null }}
                        items={userList}
                        onValueChange={(value) => setUserId(value)}
                        style={{ ...pickerSelectStyles }}
                        value={user_id}
                    />
                </View>
                <StandardGreenButton
                    title="Confirmar"
                    disabled={isButtonDisabled}
                    onPress={() => addAppointment({date, description,doctor, user_id})}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
        </View>
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
    containerTotal:{
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
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