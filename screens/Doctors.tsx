import React, { useState, useEffect } from 'react'
import { getDoctors} from '../lib/supabase'
import { StyleSheet, View, ScrollView,Text} from 'react-native'
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";
import AddButton from "../components/AddButton";
import {Button} from "react-native-elements";

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
            async function fetchData() {
                if (session) {
                    setDoctors( await getDoctors());        
                }
            }
            fetchData();
        });

        // Cleanup the listener on unmount
        return unsubscribe;
    }, [navigation, session]);

    return(
        <View style={styles.container}>
            <View style={styles.window}>
                <View style={styles.topContent}>
                    <Text style={styles.titleText}>Médicos</Text>
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
                        onPress={() => navigation.navigate('AddDoctor', {session: session})}/>
                </View>
            <ScrollView>
                <View>
                    {doctors && doctors?.length > 0  ? (
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
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.text}>No hay doctores</Text>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
            </View>
        </View>
    )
}

export default Doctors;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
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
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
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
