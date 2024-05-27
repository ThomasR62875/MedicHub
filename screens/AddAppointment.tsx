import React, {useEffect, useState} from 'react'
import {addAppointment, addDoctor, getAllDoctorsByUser, getAllUsers, getUserId} from '../lib/supabase'
import {SafeAreaView, StyleSheet, Alert, View, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {Button, Input} from "react-native-elements";
import dayjs from 'dayjs';
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Appointment} from "./Appointments";
import {DependentUser} from "./DependentUsers"
import {Doctor} from "./Doctors";
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {Picker} from "@react-native-picker/picker";
import {useTranslation} from "react-i18next";
//
import { Button as PaperButton } from 'react-native-paper';
//

type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>


const AddAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    const [doctor, setDoctor] = useState('')
    const [user_id, setUserId] = useState('')
    const [session_user_id, setSessionUserId] = useState('')
    const [all_users, setAllUsers] = useState<DependentUser[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])

    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const [show, setShow] = useState(false);


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
            date: date, description: description, user_name: '',doctor: doctor, user_id: user_id, id: ''};

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

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date | undefined): void => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
    };

    const showMode = (currentMode: 'date' | 'time'): void => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = (): void => {
        showMode('date');
    };

    const showTimepicker = (): void => {
        showMode('time');
    };


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    const [date2, setDate2] = React.useState(new Date());
    const [open, setOpen] = React.useState(false);

    const onDismissSingle = React.useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const onConfirmSingle = React.useCallback(
        (params: any) => {
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
        ({ hours, minutes }: any) => {
            setVisible(false);
            console.log({ hours, minutes });
        },
        [setVisible]
    );
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    return (
        <View style={styles.containerTotal}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View>
                    <Button onPress={showDatepicker} title="Show date picker!" />
                    <Button onPress={showTimepicker} title="Show time picker!" />
                <DateTimePicker  testID="dateTimePicker"
                                 value={date}
                                 mode={mode}
                                 is24Hour={true}
                                 onChange={onChange}
                    // locale={'ES'}
                    // options={{
                    //     mainColor: '#000',
                    //     textSecondaryColor: '#000',
                    //     borderColor: '#000',
                    //     backgroundColor: '#e9f4e9',
                    // }}
                    // // date={date}
                    // // onSelectedChange={(date: React.SetStateAction<dayjs.Dayjs>) => setDate(date)}
                />
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
                <Picker
                mode='dropdown'
                selectedValue={doctor}
                onValueChange={(value: any) => setDoctor(value)}
                placeholder='Médico'
                enabled={true}
                itemStyle={styles.pickerStyle }
                >
                    {doctorsList.map((item) => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>

                <View style={styles.pickerStyle}>
                    <Picker
                        mode='dropdown'
                        selectedValue={doctor}
                        onValueChange={(value: any) => setUserId(value)}
                        placeholder='Médico'
                        enabled={true}
                        itemStyle={styles.pickerStyle }
                    >
                        {userList.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>
                </View>
                <StandardGreenButton
                    title={t('confirm')}
                    disabled={loading}
                    onPress={handleAddAppointment}
                />
            </View>
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