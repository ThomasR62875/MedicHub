import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView,Text} from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";
import AddButton from "../components/AddButton";
import addDoctor from "./AddDoctor";

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
    const [doctors,setDoctors]= useState<Doctor[] | undefined>(undefined)

    useEffect(() => {
        if(session){
            getDoctors().then(data => {
                setDoctors(data);
            }).catch(error => {
                console.error("Error al obtener los doctores: ", error);
            });
        }
    }, []);
    async function getDoctors(): Promise<Doctor[] | undefined> {
        let to_return: Doctor[] | undefined = undefined

        const {data: user_id,error: user_data_error} = await supabase.rpc('get_independent_user_id')
        if(user_data_error)
            throw new Error(user_data_error.message);

        const {data, error} = await supabase.rpc("get_doctors", {user_id: user_id});
        console.log(data)
        if(error){
            throw new Error(error.message);
        }

        if (data.length == 0) {
            setLoading(false)
            return to_return;
        }

        to_return = [];
        data.forEach((doctor: Doctor) => {
            to_return.push({
                name: doctor.name,
                profession: doctor.profession,
                phone: doctor.phone,
                email: doctor.email,
                address: doctor.address
            });
        });
        setLoading(false)
        return to_return;
    }
    return(
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>Medicos</Text>
                </View>
                {/*<View style={styles.addContainer}>*/}
                {/*    <AddButton onPress={() => navigation.navigate({name: 'AddDoctor', params: {session: session}})}/>*/}
                {/*</View>*/}

                <View>
                    <Button title="Agregar medicos"
                            onPress={() => navigation.navigate('AddDoctor', {session: session})}
                    />
                </View>

                <View>
                    {
                        doctors ? (
                            doctors.map((doc: Doctor, i) => {
                                return (
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
                                    // AGREGAR PARA VER EL ARRAY DE ADDRESSES
                                )
                            })
                        ) : (
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>no hay doctores</Text>
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
        alignItems: 'center',
        padding: 20,
      },
    doctorContainer: {
        marginTop: 20,
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
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    }

});