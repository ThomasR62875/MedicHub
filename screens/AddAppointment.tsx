import React, { useEffect, useState } from 'react';
import { addAppointment, getAllDoctorsByUser, getAllUsers, getUserId } from '../lib/supabase';
import {StyleSheet, Alert, View, TouchableWithoutFeedback, Text, ScrollView} from 'react-native';
import {Button, Input} from "react-native-elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { DependentUser } from "./DependentUsers";
import { Doctor } from "./Doctors";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import {TextInput} from "react-native-paper";

type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>;

const AddAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }) => {
    const { session } = route.params;
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [doctor, setDoctor] = useState('');
    const [user_id, setUserId] = useState('');
    const [session_user_id, setSessionUserId] = useState('');
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>([]);
    const [doctors, setDoctors] = useState<Doctor[] | undefined>([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());

    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('');
    const { t } = useTranslation();

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
                setSessionUserId(await getUserId());
            }
            fetchUserId();
        }
    }, [session]);

    useEffect(() => {
        if (session_user_id) {
            async function getInfo() {
                setDoctors(await getAllDoctorsByUser(session_user_id));
                setAllUsers(await getAllUsers(session_user_id));
            }
            getInfo();
        }
    }, [session_user_id]);

    const handleAddAppointment = async () => {
        const appointmentDate = new Date(date);
        appointmentDate.setHours(time.getHours()-3);
        appointmentDate.setMinutes(time.getMinutes());



        const appointment = { date: appointmentDate, description, user_name: '', doctor, user_id, id: '' };
        const result = await addAppointment(appointment);
        if (result.success) {
            Alert.alert(
                t('text8'),
                '',
                [{ text: 'Ok', onPress: () => navigation.navigate('Appointments', { session }) }]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const doctorsList = doctors?.map((doctor) => ({
        label: doctor.name,
        value: doctor.id,
    }));

    const userList = all_users?.map((user) => ({
        label: user.first_name,
        value: user.id,
    }));

    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        const currentTime = selectedTime || time;
        setTime(currentTime);
    };

    return (
        <View style={styles.container}>
                    <View>
                    <View style={styles.topContent}>
                        <Text style={styles.titleText}>{t('mappointments')}</Text>
                    </View>
                    <View style={styles.datePicker}>
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                        <DateTimePicker
                            testID="timePicker"
                            value={time}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                        />
                    </View>
                    <TextInput
                        // leftIcon={{ type: 'font-awesome', name: 'book' }}
                        style={{backgroundColor: "#e9f4e9", marginTop: "10%"}}
                        label={t('description')}
                        value={description}
                        onChangeText={(text) => {
                            setDescription(text);
                            validateDescription(text);
                        }}
                        mode='outlined'
                        outlineStyle={styles.descOutline}
                        outlineColor='#2E5829FF'
                        activeOutlineColor='#2E5829FF'

                        // errorStyle={{ color: 'red' }}
                        // errorMessage={descriptionErrorMessage}
                    />
                    <Picker
                        mode='dropdown'
                        selectedValue={doctor}
                        onValueChange={(value: string) => setDoctor(value)}
                        placeholder='Médico'
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {doctorsList?.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value} />
                        ))}
                    </Picker>

                        <Picker
                            mode='dropdown'
                            selectedValue={user_id}
                            onValueChange={(value: string) => setUserId(value)}
                            placeholder='Usuario'
                            enabled={true}
                            itemStyle={styles.pickerStyle}
                        >
                            {userList?.map((item) => (
                                <Picker.Item key={item.value} label={item.label} value={item.value} />
                            ))}
                        </Picker>
                    <Button
                        title={t('confirm')}
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderColor: 'white',
                            borderRadius: 20,
                            minHeight: 10,
                            minWidth: 10,
                            maxWidth: '40%'
                        }}
                        disabled={loading}
                        titleStyle={{ color: '#E9F4E9',fontSize: 15, margin: 5 }}
                        onPress={handleAddAppointment}/>
                    </View>
        </View>
    );
}

export default AddAppointment;

const styles = StyleSheet.create({
    containerTotal: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        alignContent: 'center'
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
    pickerStyle: {
        marginBottom: 20,
    },
    topContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: "10%",

    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 14,
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    },
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "70%"
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
        height: '100%'
    },
    window: {
        marginTop: "10%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    datePicker: {
        flexDirection: 'row',
    },
    descOutline: {
    }
});
