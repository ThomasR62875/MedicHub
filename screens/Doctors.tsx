import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView,Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";

const Stack = createNativeStackNavigator();

interface Doctor {
    name: string;
    profession: string;
    phone: string;
    email: string;
    address: [string];
}

type DoctorProps = NativeStackScreenProps<RootStackParamList, 'Doctors'>;

const Doctors: React.FC<DoctorProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [doctors,setDoctors]= useState<Doctor[]>([])

    useEffect(() => {
        if (session) getDoctors()
    }, [session])

    async function getDoctors(): Promise<Doctor[]> {
        let to_return: Doctor[] = []
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error, status} = await supabase
                .from('doctor')
                .select()
                .contains('users', [session?.user.id])
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                data.forEach(doctor => {
                    to_return.push({
                        name: doctor.name,
                        profession: doctor.profession,
                        phone: doctor.phone,
                        email: doctor.email,
                        address: doctor.addresses
                    })
                });
            }

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
        setLoading(false)
        setDoctors(to_return)
        return to_return;
    }
    return(
        <View style={styles.container}>
            <ScrollView>
                <View>
                    <Text>Medicos</Text>
                </View>
                <View>
                    {
                    doctors.map((doc: Doctor,i)=> {
                        return(
                            <View key="{i}" style={styles.doctorView}>
                                <Text key="{doc.name}{i}" style={styles.doctorViewText}>{doc.name}</Text>
                                <Text key="{doc.profession}{i}" style={styles.doctorViewText}>{doc.profession}</Text>
                                <Text key="{doc.email}{i}" style={styles.doctorViewText}>{doc.email}</Text>
                            </View>
                        )
                    })
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default Doctors;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
    doctorView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
    },
    doctorViewText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    }
  });