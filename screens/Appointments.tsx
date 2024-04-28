import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet,ScrollView ,View, Text ,Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";




type AppointmentsProps = NativeStackScreenProps<RootStackParamList, 'Appointments'>;

export type Appointment = {
    date: Date;
    description:string;
    user_name:string;
}

const Appointments: React.FC<AppointmentsProps> = ({ navigation, route }) => {
    const {session} = route.params
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState<Appointment[]>([])

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

                        if (user_error) {
                            throw user_error;
                        }

                        // Aquí puedes hacer lo que necesites con user_data
                        // Por ejemplo, agregarlo a to_return
                        to_return.push({
                            description: appoint.description,
                            date: appoint.date,
                            user_name: user_data.first_name // Suponiendo que name es el campo que quieres agregar
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
                <ScrollView>
                    <View>
                        <Text>Appointments</Text>
                    </View>
                    <View>
                        {
                            appointments.map((appoint:Appointment,i)=> {
                                return(
                                    <View key={i} style={styles.appointmentView}>
                                        <Text style={styles.appointmentViewText}>{appoint.description}</Text>
                                        <Text style={styles.appointmentViewText}>{appoint.user_name}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>

                    <View>
                        <Button title="Add Appointment"
                                onPress={() => navigation.navigate('AddAppointment', {session: session})}
                        />
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
        alignItems: 'center',
        padding: 20,
      },
    appointmentView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
    },
    appointmentViewText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    }
  });