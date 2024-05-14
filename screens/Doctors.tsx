import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, ScrollView,Text} from 'react-native'
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";
import AddButton from "../components/AddButton";

const Stack = createNativeStackNavigator();

export type Doctor = {
    name: string;
    specialty: string;
    phone: string;
    email: string;
    addresses: string[];
    id:string;
}

type DoctorProps = NativeStackScreenProps<RootStackParamList, 'Doctors'>;

const Doctors: React.FC= ({ navigation, route }: any) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [doctors,setDoctors]= useState<Doctor[] | undefined>(undefined)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (session) {
                setLoading(true);
                getDoctors().then(data => {
                    setDoctors(data);
                }).catch(error => {
                    console.error("Error al obtener los doctores: ", error);
                }).finally(() => {
                    setLoading(false);
                });
            }
        });

        // Cleanup the listener on unmount
        return unsubscribe;
    }, [navigation, session]);

    async function getDoctors(): Promise<Doctor[] | undefined> {
        let to_return: Doctor[] | undefined = undefined

        const {data: user_id,error: user_data_error} = await supabase.rpc('get_independent_user_id')
        if(user_data_error)
            throw new Error(user_data_error.message);

        const {data, error} = await supabase.rpc("get_doctors", {user_id: user_id});
        if(error){
            throw new Error(error.message);
        }

        if (data.length == 0) {
            setLoading(false)
            return to_return;
        }

        to_return = [];
        data.forEach((doctor: Doctor) => {
            // @ts-ignore
            to_return.push({
                name: doctor.name,
                specialty: doctor.specialty,
                phone: doctor.phone,
                email: doctor.email,
                addresses: doctor.addresses,
                id:doctor.id
            });
        });
        setLoading(false)
        return to_return;
    }
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Medicos</Text>
            </View>
            <View style={styles.addContainer}>
                <AddButton onPress={() => navigation.navigate({name: 'AddDoctor', params: {session: session}})}/>
            </View>
            <ScrollView>
                <View>
                    {doctors ? (
                            doctors.map((doc: Doctor, i) => {
                                return (
                                    <View key={i} style={styles.doctorContainer}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Nombre:</Text>
                                            <Text style={styles.value}>{doc.name}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Especialidad:</Text>
                                            <Text style={styles.value}>{doc.specialty}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Mail:</Text>
                                            <Text style={styles.value}>{doc.email}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Teléfono:</Text>
                                            <Text style={styles.value}>{doc.phone}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Dirección:</Text>
                                            <Text style={styles.value}>{doc.addresses}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        ) : (
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>No has cargado doctores aún.</Text>
                                <Text style={[styles.titleText, {fontSize: 16, fontStyle: 'italic'}]}>Usa el simbolo + de la esquina superior derecha para agregar tu primer doctor</Text>
                            </View>
                        )
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
        padding: 20,
        backgroundColor: '#e9f4e9',
        height: '100%',
      },
    bottomBar:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    titleContainer: {
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
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
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    }
});
