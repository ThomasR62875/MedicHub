import React, { useEffect, useState } from 'react';
import { updateAppointment, getAppointmentById, getAllDoctorsByUser, getAllUsers } from '../lib/supabase';
import { SafeAreaView, StyleSheet, Alert, View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import {Button, Input} from 'react-native-elements';
import dayjs from 'dayjs';
import StandardGreenButton from '../components/StandardGreenButton';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Appointment } from './Appointments';
import { DependentUser } from './DependentUsers';
import { Doctor } from './Doctors';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-modern-datepicker';

type EditAppointmentProps = NativeStackScreenProps<RootStackParamList, 'EditAppointment'>;

const EditAppointment: React.FC<EditAppointmentProps> = ({ navigation, route }) => {
    const { session } = route.params;
    const [date, setDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [doctor, setDoctor] = useState('');
    const [user_id, setUserId] = useState('');
    const [session_user_id, setSessionUserId] = useState('');
    const [all_users, setAllUsers] = useState<DependentUser[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    const doctorsList = doctors
        ? doctors.map((doctor: Doctor) => ({
            label: doctor.name,
            value: doctor.id,
        }))
        : [];

    const userList = all_users
        ? all_users.map((user: DependentUser) => ({
            label: user.first_name,
            value: user.id,
        }))
        : [];

    return (
        <View style={styles.containerTotal}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <SafeAreaView style={styles.container}>
                    <Input label="Descripción" value={description} onChangeText={(text) => setDescription(text)}/>

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
                    <Button
                        title="Guardar cambios"
                        loading={loading}
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            alignContent: 'center'
                        }}
                        titleStyle={{ color: '#eef9ed' }}
                        onPress={() => updateAppointment({id, date, description, doctor, user_id})}
                    />
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </View>
    );
};

export default EditAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    containerTotal: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center',
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
    pickerStyle: {
        marginBottom: 20,
    },
});

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
