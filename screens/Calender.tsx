import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import React, {useEffect, useState} from "react";
import {Alert, ScrollView, StyleSheet, Text, View} from "react-native";
import {supabase} from "../lib/supabase";
import BottomBar from "../components/BottomBar";
import AddButton from "../components/AddButton";
import {Appointment} from "./Appointments";
import {Calendar} from "react-native-calendars";
import TurnoContainer from "../components/TurnContainer";

type CalenderScreenProps = NativeStackScreenProps<RootStackParamList, 'Calender'>;

const Calender: React.FC<CalenderScreenProps> = ({ navigation, route }) => {
    const {session} = route.params;
    //esto es copy paste de Home, deberia seleccionar los turnos q coincidan con la fecha seleccionada en el calendariio todo
    //tal fecha tiene q tener el automatico en "HOY"
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    let turno1: { date: any; description: any; user_name: any; doctor?: string; user_id?: string; }, turno2 : Appointment | null = null;
    let date1: Date, date2 : Date | null = null;

    //se tiene q orderna por fecha appointments todo

    if (appointments && appointments.length==1) {
        turno1 = appointments[0];
        date1 = new Date(turno1.date);
    }
    if (appointments && appointments?.length > 1) {
        turno2 = appointments[1];
        date2 = new Date(turno2.date);
    }

    const markedDatesArray = ['2024-05-10', '2024-05-15'];
    const markedDates = markedDatesArray.reduce<{ [key: string]: { marked: boolean, dotColor: string } }>((acc, date) => {
        acc[date] = { marked: true, dotColor: '#038839' };
        return acc;
    }, {});


    useEffect(() => {
        if (session) getProfile()
    }, [session])

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
        <View>
            <Calendar
            markingType={'custom'}
            markedDates={markedDates}
            />
            <ScrollView>

                {/*
                <TurnoContainer>
                </TurnoContainer>
                turno1 && date1 ? (
                    <View>

                        <View style={styles.turnoContainer}>
                            <View style={styles.infoRow}>
                                <Text>{turno1.description}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Usuario:</Text>
                                <Text>{turno1.user_name}</Text>
                                <View style={{ width: 30 }} />
                                <Text style={styles.label}>Fecha:</Text>
                                <Text>{`${date1.getDate()}/${date1.getMonth()}/${date1.getFullYear()}`}</Text>
                            </View>
                        </View>
                        {turno2 && date2 ? (
                            <View style={styles.turnoContainer2}>
                                <View style={styles.infoRow}>
                                    <Text>{turno2.description}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Text style={styles.label}>Usuario:</Text>
                                    <Text>{turno2.user_name}</Text>
                                    <View style={{ width: 30 }} />
                                    <Text style={styles.label}>Fecha:</Text>
                                    <Text>{`${date2.getDate()}/${date2.getMonth()}/${date2.getFullYear()}`}</Text>
                                </View>
                            </View>
                        ) : (<View/>) }
                    </View>
                ) : (
                    <View style={[styles.turnoContainer, {padding: 10}]}>
                        <Text style={styles.text}>No hay turnos</Text>
                        <Text style={[styles.text, {fontStyle: 'italic'}]}> Presiona el + para crear tu primer turno</Text>
                        <AddButton onPress={() => navigation.navigate('AddAppointment', {session})} />
                    </View>
                )} */}
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
    },
    turnoContainer2: {
        backgroundColor: '#D6EFD4',
        borderColor: 'black',
        borderWidth: 1,
        borderTopWidth: 0,
    },
    //al aplicar el component turnContainer eliminar infoRow y label, todo
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
        padding: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
});

export default Calender;