import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Image, Pressable, Dimensions, ScrollView} from 'react-native';
import {Icon} from "react-native-elements";
import {Card} from '../components/Card';
import {supabase} from "../lib/supabase";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Appointment} from "./Appointments";
import TurnoContainer from "../components/TurnContainer";

const Home: React.FC = ({navigation, route}: any) => {
    const session = route.params.session;
    const [first_name, setFirstName] = useState('')
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const imgDoc = require('../assets/doc.png');
    const imgTurno = require('../assets/calendario.png');
    const imgMed = require('../assets/meds.png');
    const screenHeight = Dimensions.get('window').height;
    const percentageMargin = screenHeight * 0.05;
    let turno1, turno2 : Appointment | null = null;
    let date1, date2 : Date | null = null;

    //se tiene q orderna por fecha appointments todo

    if (appointments && appointments.length==1) {
        turno1 = appointments[0];
        date1 = new Date(turno1.date);
    }
    if (appointments && appointments?.length > 1) {
        turno2 = appointments[1];
        date2 = new Date(turno2.date);
    }

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            if (!session?.user) throw new Error('No user on the session!')
            const {data} = await supabase.rpc('get_independent_user', {auth_id_input: session?.user.id});

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
                        const { data: doctor_data} = await supabase.rpc('get_doctor', {doctor_id: appoint.doctor})
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
            <View style={styles.container}>
                <Text style={styles.titleText}>Bienvenido {first_name}</Text>
                <ScrollView style={{width:'90%'}}>
                    <Pressable style={{marginTop: percentageMargin}}
                               onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}>
                        {turno1 && date1 ? (
                                <View>
                                    <TurnoContainer
                                        turno={turno1}
                                        date={date1}
                                        styleExterior={styles.turnoContainer}
                                    />
                                    {turno2 && date2 ? (
                                        <TurnoContainer
                                            styleExterior={styles.turnoContainer2}
                                            date={date2}
                                            turno={turno2}
                                        />
                                    ) : (<View/>) }
                                </View>
                            ) : (
                                <View style={[styles.turnoContainer, {padding: 10}]}>
                                    <Text style={styles.text}>No hay turnos</Text>
                                    <Text style={[styles.text, {fontStyle: 'italic'}]}>Anda al calendario para crear tu primer turno</Text>
                                </View>
                            )}
                        <View style={styles.card}>
                            <Text style={[styles.titleText, {justifyContent:'center'}]}>Proximos turnos</Text>
                        </View>
                    </Pressable>
                    <Pressable style={{marginTop: percentageMargin}} >
                        <View style={[styles.turnoContainer, {padding: 10}]}>
                            <Text style={[styles.text, {fontStyle: 'italic'}]}>Esperar la aplicación de la IA porfavor :)</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={[styles.titleText, {justifyContent:'center'}]}>Turnos recomendados</Text>
                        </View>
                    </Pressable>
                    {/* <View style={styles.grid}>
                            <View style={styles.col}>
                                <Card title="Archivos" img={imgTurno} onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}/>
                                <View style={{ marginBottom: 30 }} />
                                <Card title="Medicamentos" img={imgMed}  onPress={() => navigation.navigate({name: 'Medication', params: {session: session}})}/>
                            </View>
                        </View>

                        Los tratamos como widgets, dejamos q se puedan agregar solo 2 cards, para eliminarlas usamos onLongPress
                        todo
                    */}
                </ScrollView>
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
    bottomBar:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 18,
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
        backgroundColor: '#D6EFD4',
        borderColor: 'black',
        borderWidth: 1,
        borderTopWidth: 0,
    },
});

export default Home;
