import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet,ScrollView ,View, Text ,Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'

interface Appointment {
    date: Date;
    description:string;
}

export default function Appointments({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState([])

    useEffect(() => {
        if (session) getAppointments()
    }, [session])
    
    async function getAppointments() {
        let to_return: Appointment[]=[]
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error, status} = await supabase
                .from('appointment')
                .select('id, date,description,doctor,user')
                .eq('user', session?.user.id)
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                data.forEach(appoint => {
                    to_return.push({
                        description: appoint.description,
                        date: appoint.date,
                    })
                });
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
                        appointments.map((appoint)=> {
                            return(
                                <View style={styles.appointmentView}>
                                    <Text style={styles.appointmentViewText}>{appoint.date}</Text>
                                    <Text style={styles.appointmentViewText}>{appoint.description}</Text>
                                </View>
                            )
                        })
                        }
                    </View>
                </ScrollView>
            </View>
    )
}

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