import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet,ScrollView ,View, Text ,Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Doctor} from "./Doctors";
import AddButton from "../components/AddButton";




type AppointmentsProps = NativeStackScreenProps<RootStackParamList, 'Appointments'>;

export type Appointment = {
    date: Date;
    description:string;
    user_name:string;
    doctor: string;
    user_id: string;
}

const Appointments: React.FC<AppointmentsProps> = ({ navigation, route }) => {
    const {session} = route.params
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)

    useEffect(() => {
        if (session) getAppointments()
    }, [session])

    async function getAppointments() {
        const to_return: Appointment[] = [];
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data: user_id,error: user_data_error} = await supabase.rpc('get_independent_user_id')
            if(user_data_error)
                throw new Error(user_data_error.message);

            const {data, error, status} = await supabase.rpc('get_appointments', {user_id: user_id})
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                for (const appoint of data) {
                    try {
                        const { data: user_data, error: user_error } = await supabase.rpc('get_user', {user_id: appoint.user})
                        const { data: doctor_data, error: doctor_error } = await supabase.rpc('get_doctor', {doctor_id: appoint.doctor})
                        if (user_error) {
                            throw user_error;
                        }
                        // Aquí puedes hacer lo que necesites con user_data
                        // Por ejemplo, agregarlo a to_return
                        to_return.push({
                            description: appoint.description,
                            date: appoint.date,
                            user_name: user_data.first_name, // Suponiendo que name es el campo que quieres agregar
                            doctor: doctor_data && doctor_data.name ? doctor_data.name.concat(" (especialidad: ").concat(doctor_data.specialty).concat(")") : 'Sin datos de doctor',
                            user_id: appoint.user,
                        });
                    } catch (error) {
                        console.error('Error al obtener el usuario:', error);
                    }
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
        setLoading(false)
        setAppointments(to_return)
    }
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Turnos</Text>
            </View>
            <View style={styles.addContainer}>
                <AddButton onPress={() => navigation.navigate({name: 'AddAppointment', params: {session: session}})}/>
            </View>
            <ScrollView>
                <View>
                    {
                        (appointments?.length ?? 0) > 0 ? (
                            appointments.map((appointment: Appointment, i) => {
                                const originalDate = new Date(appointment.date);
                                const formattedDate = `${originalDate.getDate()}/${originalDate.getMonth() + 1}/${originalDate.getFullYear()}`;
                                const formattedTime = `${originalDate.getHours()}:${originalDate.getMinutes().toString().padStart(2, '0')}`;
                                return (
                                    <View key={i} style={styles.doctorContainer}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Usuario:</Text>
                                            <Text style={styles.value}>{appointment.user_name}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Fecha:</Text>
                                            <Text style={styles.value}>{formattedDate}</Text>
                                            <Text style={styles.label}>Hora:</Text>
                                            <Text style={styles.value}>{formattedTime}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Doctor:</Text>
                                            <Text style={styles.value}>{appointment.doctor}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Descripcion:</Text>
                                            <Text style={styles.value}>{appointment.description}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        ) : (
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>No hay turnos</Text>
                                <Text style={[styles.titleText, {fontSize: 16, fontStyle: 'italic'}]}>Usa el simbolo + de la esquina superior derecha para agregar tu primer doctor</Text>
                            </View>
                        )}
                </View>
            </ScrollView>
        </View>
    )
}

export default Appointments

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    doctorContainer: {
        marginTop: 10,
        backgroundColor: '#C2E5D3',
        marginBottom: 10,
        borderRadius: 5,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
    titleContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    }

});