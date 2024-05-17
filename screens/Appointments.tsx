import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet,ScrollView ,View, Text ,Alert } from 'react-native'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import AddButton from "../components/AddButton";
import AppointmentButton from "../components/AppointmentButton";
import {Button} from "react-native-elements";
import {DependentUser} from "./DependentUsers";

export type Appointment = {
    date: Date;
    description:string;
    user_name:string;
    doctor: string;
    user_id: string;
}
const Appointments: React.FC =  ({navigation, route}: any) =>{
    const session = route.params.session;
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (session) {
                getAppointments();
            }
        });

        return unsubscribe;
    }, [navigation, session]);

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
            <View style={styles.window}>
                <View style={styles.topContent}>
                    <Text style={styles.titleText}>Tus turnos</Text>
                    <Button
                        title="Agregar"
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderColor: 'white',
                            borderRadius: 20,
                            minHeight: 10,
                            minWidth: 10,
                        }}
                        titleStyle={{ color: '#E9F4E9',fontSize: 15, margin: 5 }}
                        onPress={() => navigation.navigate('AddAppointment', {session: session})}/>
                </View>
                <ScrollView>
                                {appointments && appointments?.length > 0 ? (
                                        appointments.map((appointment: Appointment, i) => {
                                         return (
                                             <View key={i} style={styles.appointContainer}>
                                                 <AppointmentButton onPress={() => navigation.navigate({name: 'SingleAppointment', params: {appointment: appointment}})} styleExterior={styles.appointContainer} date={appointment.date} turno={appointment}></AppointmentButton>
                                                    <View style={{ marginBottom: 100 }} />
                                             </View>
                                            )
                                       })
                                    ) : (
                                        <View style={[styles.titleContainer, {}]}>
                                            <Text style={styles.text}>No hay turnos</Text>
                                        </View>
                                    )}
                       </ScrollView>
            </View>
        </View>
    );
};

export default Appointments

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
    },
    titleContainer: {
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    },
    appointContainer: {
        marginTop: '5%',
        alignItems: 'center',
        borderRadius: 10,
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
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    },
    window: {
        marginTop: "20%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    topContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: "5%",

    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 14,
        textAlign: 'left',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    }
});