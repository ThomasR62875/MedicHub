import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Pressable} from 'react-native';
import {Icon} from "react-native-elements";
import {Card} from '../components/Card';
import {supabase} from "../lib/supabase";
import {Appointment} from "./Appointments";


const Home: React.FC = ({navigation, route}: any) => {
    const session = route.session;
    const [first_name, setFirstName] = useState('')
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const imgDoc = require('../assets/doc.png');
    const imgTurno = require('../assets/calendario.png');
    const imgMed = require('../assets/meds.png');
    const width = '90%';
    let turno1, turno2 : Appointment | null = null;
    let date1, date2 : Date | null = null;;

    //se tiene q orderna por fecha appointments todo

    if (appointments) {
        turno1 = appointments[0];
        // date1 = new Date(turno1.date);
    }
    if (appointments && appointments?.length > 1) {
        turno2 = appointments[1];
        // date2 = new Date(turno2.date);
    }

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            if (!session?.user) throw new Error('No user on the session!')
            const {data, error} = await supabase.rpc('get_independent_user', {auth_id_input: session?.user.id});

            if (data) {
                setFirstName(data.first_name)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

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

    return (
        <View>
            <View style={styles.profileIconContainer} >
                <Icon name='person-circle-outline' type='ionicon' onPress={() => navigation.navigate({name: 'Account', params: {session: session}})} size={35} />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Bienvenido {first_name}</Text>
                <View style={styles.grid}>
                    <View style={styles.col}>
                        <Card title="Turnos" img={imgTurno} onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}/>
                        <View style={{ marginBottom: 30 }} />
                    </View>
                    <View style={styles.col}>
                        <Card title="Médicos" img={imgDoc}  onPress={() => navigation.navigate({name: 'Doctors', params: {session: session}})}/>
                        <View style={{ marginBottom: 30 }} />
                        <Card title="Medicamentos" img={imgMed}  onPress={() => navigation.navigate({name: 'Medication', params: {session: session}})}/>
                    </View>
                </View>
                <Pressable style={{ width: width}} >
                    {/*
                        turno1 && date1 &&(
                            <View>
                            <View style={styles.turnoContainer}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Usuario:</Text>
                                    <Text>{turno1.user_name}</Text>
                                    <View style={{ width: 30 }} />
                                    <Text style={styles.label}>Fecha:</Text>
                                    <Text>{`${date1.getDate()}/${date1.getMonth()}/${date1.getFullYear()}`}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Descripcion:</Text>
                                    <Text>{turno1.description}</Text>
                                </View>
                            </View>
                            <View style={styles.turnoContainer2}>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Usuario:</Text>
                                    <Text>{turno2?.user_name}</Text>
                                    <View style={{ width: 30 }} />
                                    <Text style={styles.label}>Fecha:</Text>
                                    <Text>{`${date2?.getDate()}/${date2?.getMonth()}/${date2?.getFullYear()}`}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Descripcion:</Text>
                                    <Text>{turno2?.description}</Text>
                                </View>
                            </View>
                            </View>
                        ) } : {(
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>No hay turnos</Text>
                                <Text style={[styles.titleText, {fontSize: 16, fontStyle: 'italic'}]}>Usa el simbolo + de la esquina superior derecha para agregar tu primer doctor</Text>
                            </View>
                        ) */}
                    <View style={styles.card}>
                        <Text style={styles.text}>Proximos turnos</Text>
                    </View>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileIconContainer: {
        top: 10,
        left: 315,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B5DCCA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 10,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#B5DCCA',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 3,
        height: 45
    },
    img: {
        height: 150,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    turnoContainer: {
        backgroundColor: '#D6EFD4',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
    },
    turnoContainer2: {
        backgroundColor: '#C2E5D3',
        borderColor: 'black',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
        padding: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
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
    }
});

export default Home;
