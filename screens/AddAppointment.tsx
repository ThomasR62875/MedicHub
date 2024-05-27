import React, {useEffect, useState} from 'react'
import {addAppointment, getAllDoctorsByUser, getAllUsers, getUserId} from '../lib/supabase'
import {SafeAreaView, StyleSheet, Alert, View, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {Input} from "react-native-elements";
import dayjs from 'dayjs';
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {DependentUser} from "./DependentUsers"
import {Doctor} from "./Doctors";
import RNPickerSelect from 'react-native-picker-select';
import {useTranslation} from "react-i18next";
//
import { DatePickerModal } from 'react-native-paper-dates';
import { TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from 'react-native-paper';
import { es } from 'date-fns/locale';
//

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
    const {t} = useTranslation();

    const validateDescription = (value: string) => {
        if (value.trim() === '') {
            setDescriptionErrorMessage(t('text7'));
        } else {
            setDescriptionErrorMessage('');
        }
    };

    useEffect(() => {
        if (session) {
            async function fetchUserId() {
                // @ts-ignore
                setSessionUserId(await getUserId());
            };
            fetchUserId();

        }
    }, [session]); // Dependencia de sesión para ejecutar solo cuando la sesión cambie

    useEffect(() => {
        if (session_user_id) {
            async function getInfo() {
                // @ts-ignore
                setDoctors(await getAllDoctorsByUser(session_user_id));
                // @ts-ignore
                setAllUsers(await getAllUsers(session_user_id));
            }
            getInfo()
        }
    }, [session_user_id]);


    const handleAddAppointment = async () => {
        const appointment = {
            date: date.toDate(), description: description, user_name: '',doctor: doctor, user_id: user_id, id: ''};

        const result = await addAppointment(appointment);
        if (result.success) {
            Alert.alert(
                t('text8'),
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Appointments', { session: session }) }
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const doctorsList = doctors ? (doctors as Doctor[]).map((doctor: Doctor) => ({
        label: doctor.name,
        value: doctor.id,
    })): [];

    const userList = all_users ? (all_users as DependentUser[]).map((user: DependentUser) => ({
        label: user.first_name,
        value: user.id,
    })): [];

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [date2, setDate2] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);

    const onDismissSingle = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = React.useCallback(
        (params) => {
            setOpen(false);
            setDate2(params.date);
        },
        [setOpen, setDate2]
    );

    const [visible, setVisible] = React.useState(false)
    const onDismiss = React.useCallback(() => {
        setVisible(false)
    }, [setVisible])

    const onConfirm = React.useCallback(
        ({ hours, minutes }) => {
            setVisible(false);
            console.log({ hours, minutes });
        },
        [setVisible]
    );
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <View style={styles.containerTotal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={styles.container}>
                    <SafeAreaProvider>
                        <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                            <Button onPress={() => setOpen(true)} uppercase={false} mode="outlined">
                                Seleccionar fecha
                            </Button>
                            <View style={{ marginTop: 40 }}>
                                <DatePickerModal
                                    locale="es"
                                    mode="single"
                                    visible={open}
                                    onDismiss={onDismissSingle}
                                    date={date2}
                                    onConfirm={onConfirmSingle}
                                    presentationStyle={"pageSheet"}
                                />
                            </View>
                            <Button onPress={() => setVisible(true)} uppercase={false} mode="outlined">
                                Seleccionar horario
                            </Button>
                            <View>
                                <TimePickerModal
                                    visible={visible}
                                    onDismiss={onDismiss}
                                    onConfirm={onConfirm}
                                    hours={12}
                                    minutes={14}
                                />
                            </View>
                        </View>
                    </SafeAreaProvider>
                    <Input
                    leftIcon={{ type: 'font-awesome', name: 'book' }}
                    style={styles.verticallySpaced}
                    placeholder={t('description')}
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
                        placeholder={{ label: t('doc'), value: null }}
                        items={doctorsList}
                        onValueChange={(value) => setDoctor(value)}
                        style={{ ...pickerSelectStyles }}
                        value={doctor}
                    />
                </View>
                <View style={styles.pickerStyle}>
                    <RNPickerSelect
                        placeholder={{ label: t('user'), value: null }}
                        items={userList}
                        onValueChange={(value) => setUserId(value)}
                        style={{ ...pickerSelectStyles }}
                        value={user_id}
                    />
                </View>
                <StandardGreenButton
                    title={t('confirm')}
                    disabled={loading}
                    onPress={handleAddAppointment}
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
        paddingRight: 30,
    },
});