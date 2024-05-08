import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import React, {useEffect, useState} from "react";
import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {supabase} from "../lib/supabase";
import BottomBar from "../components/BottomBar";
import Appointments, {Appointment} from "./Appointments";
import {Calendar} from "react-native-calendars";
import AddButton from "../components/AddButton";
import TurnoContainer from "../components/TurnContainer";

type CalenderScreenProps = NativeStackScreenProps<RootStackParamList, 'Calender'>;

const Calender: React.FC<CalenderScreenProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    let targetDate = new Date('2024-05-10'); //el default = new Date(); todo
    let filteredData : Appointment[] | undefined = undefined; //es un array donde se guardan todos los appointments los cuales su date coinciden con el día seleccionado en el calendario
    let markedDates : string[] = []; //Es un array donde se guardan todos los dates de appointments, en formato string YYYY-MM-DD porq es lo q usa el calendar
    if(appointments){
        filteredData = appointments.filter(item => {
            return item.date instanceof Date && item.date.toISOString().slice(0, 10) === targetDate.toISOString().slice(0, 10);
        });
        markedDates = appointments.map(item => item.date.toString().slice(0,10));
    }


    const markedDatesString = markedDates.reduce<{ [key: string]:
            { marked: boolean, dotColor: string } }>((acc, date) => {
        acc[date] = { marked: true, dotColor: '#038839' };
        return acc;
    }, {});


    useEffect(() => {
        if (session) {
            getProfile()
            getAppointments()
        }
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
    async function getProfile() {
        try {
            if (!session?.user) throw new Error('No user on the session!')
            const {data, error} = await supabase.rpc('get_independent_user', {auth_id_input: session?.user.id});

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    return (
        <View style={{height: '100%'}}>
            <Calendar
            markingType={'custom'}
            markedDates={markedDatesString}
            />
            {/*TODO
             -cambiar el color con el q se marca q fecha es hoy
             -trackear q fecha esta siendo seleccionada, osea diferente a q fecha es hoy, (la q este seleccionada debe verse con un circulito marcada)
             -igualar targetDate a esa fecha seleccionada, y q siempre se actualice al momento
             */}
            <ScrollView>
                {filteredData? (
                    filteredData.map((turno: Appointment, i: number) => {
                        return(
                            <View key={i}>
                                <TurnoContainer
                                    date={turno.date}
                                    turno={turno}
                                    styleExterior={styles.turnoContainer}
                                />
                            </View>
                        )
                })) :  (
                    <View style={[styles.turnoContainer, {padding: 10}]}>
                        <Text style={styles.text}>No hay turnos este día</Text>
                        <Text style={[styles.text, {fontStyle: 'italic'}]}> Presiona el + para crear tu primer turno</Text>
                    </View>
                )
                }
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <AddButton onPress={() => navigation.navigate('AddAppointment', {session})} />
                    <View style={{marginTop:60}}>
                        {!filteredData && <Text>filteredData is undefined</Text>}
                        {!markedDates && <Text>markedDatesArray is undefined</Text>}

                        {filteredData && (
                            <>
                                <Text>Contenido de filteredData:</Text>
                                <Text>{filteredData.length}</Text>
                                {filteredData.map((item, index) => (
                                    <Text key={index}>{item.date.toString()}</Text>
                                ))}
                            </>
                        )}

                        {markedDates && (
                            <>
                                <Text>Contenido de markedDates:</Text>
                                <Text>{markedDates.length}</Text>
                                {markedDates.map((date, index) => (
                                    <View>
                                        <Text key={index}>{date}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.bottomBar}>
                <BottomBar navigation={navigation} route={route} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bottomBar:{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
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
    turnoContainer: {
        backgroundColor: '#D6EFD4',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%',
    },
});

export default Calender;