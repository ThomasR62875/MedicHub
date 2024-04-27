import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView,Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";

const Stack = createNativeStackNavigator();

export type Doctor = {
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
        const {data, error} = await supabase.rpc("get_doctors", {id: supabase.rpc("get_independent_user_id")})

        if(error){
            throw new Error(error.message);
        }
        return data as Doctor[];
        // let to_return: Doctor[] = []
        // try {
        //     setLoading(true)
        //     if (!session?.user) throw new Error('No user on the session!')
        //
        //     const {data, error, status} = await supabase
        //         .from('user_doctor')
        //         .select("independent_user(name,profession,phone,email,address)")
        //         .eq("user",session?.user.id)
        //     if (error && status !== 406) {
        //         throw error
        //     }
        //
        //     if (data) {
        //         data.forEach((doctor: Doctor) => {
        //             to_return.push({
        //                 name: doctor.name,
        //                 profession: doctor.profession,
        //                 phone: doctor.phone,
        //                 email: doctor.email,
        //                 address: doctor.addresses
        //             })
        //         });
        //     }
        //
        // } catch (error) {
        //     if (error instanceof Error) {
        //         Alert.alert(error.message)
        //     }
        // }
        // setLoading(false)
        // setDoctors(to_return)
        // return to_return;
    }
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Medicos</Text>
                </View>

                <View>
                    {
                    doctors.map((doc: Doctor,i)=> {
                        return(
                            <View key={i} style={styles.doctorContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Nombre:</Text>
                                    <Text style={styles.value}>{doc.name}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Especialidad:</Text>
                                    <Text style={styles.value}>{doc.profession}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Mail:</Text>
                                    <Text style={styles.value}>{doc.email}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Teléfono:</Text>
                                    <Text style={styles.value}>{doc.phone}</Text>
                                </View>
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
    doctorContainer: {
        backgroundColor: '#C2E5D3',
        marginBottom: 20,
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
    },


});