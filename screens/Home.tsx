import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Image, Pressable, Dimensions, ScrollView} from 'react-native';
import {Button, Icon} from "react-native-elements";
import {Card} from "react-native-elements"
import {supabase} from "../lib/supabase";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Appointment} from "./Appointments";
import TurnoContainer from "../components/TurnContainer";
// @ts-ignore
import Logo from "../assets/icon.png";

const Home: React.FC = ({navigation, route}: any) => {
    const session = route.params.session;
    const [sessionId, setSessionId] = useState('')
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
        turno1 = appointments[0];
        date1 = new Date(turno1.date);
        turno2 = appointments[1];
        date2 = new Date(turno2.date);
    }




    useEffect(() => {
        if (session)
            setSessionId(session);
    }, [sessionId])


    useEffect(() => {
        if (session) getProfile()
        if (sessionId) getAppointments()
    }, [sessionId])

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
        setSessionId('')
    }

    return (
            <View style={styles.container}>
                <View style={styles.centerContent}>
                    <ScrollView style={{width:'85%', marginLeft: "5%",  marginRight: "5%", height: "100%"}}>
                        <Text style={styles.screenTitle}>Bienvenido {first_name}!</Text>
                        <Pressable style={{margin: "1%"}}
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
                                    <View style={[styles.turnoContainer]}>
                                        <View style={styles.card}>
                                            <Text style={[styles.titleText, {justifyContent:'center'}]}>Proximos turnos</Text>
                                        </View>
                                        <Text style={styles.text}>No hay turnos</Text>
                                        <Text style={[styles.text, {fontStyle: 'italic'}]}>Anda al calendario para crear tu primer turno</Text>
                                    </View>
                                )}
                        </Pressable>
                        <Pressable style={{margin: "1%"}}>
                            <View style={[styles.turnoContainer]}>
                                <View style={styles.card}>
                                    <Text style={[styles.titleText, {justifyContent:'center'}]}>Turnos recomendados</Text>
                                </View>
                                <Text style={[styles.text]}>Esperar la aplicación de la IA porfavor :)</Text>
                            </View>
                        </Pressable>
                        <View>

                        </View>
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

const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    bottomBar:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    container: {
        backgroundColor: "#E9F4E9",
        height: '100%',
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
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829",
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        color: "#2E5829",
        fontFamily: 'Roboto-Thin',
        margin: "4%"
    },
    card: {
        backgroundColor: '#B7DAB1',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 3,
        height: 45
    },
    img: {
        height: 150,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    turnoContainer: {
        backgroundColor: '#CBE4C9',
        borderRadius: 20,
        marginTop: "10%",
        borderColor: '#CBE4C9',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    turnoContainer2: {
        backgroundColor: '#D6EFD4',
        borderColor: '#D6EFD4',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    logo:{
        color: '#407738',
        width: 50,
        height: 50,

    },
    topContent: {
        alignItems: 'flex-start',
        marginTop: "8%",
        marginLeft: "6%"
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "30%"
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
    }
});

export default Home;
