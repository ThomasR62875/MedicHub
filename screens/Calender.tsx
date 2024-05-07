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
    const targetDate = new Date('2024-05-10'); // esta seria el default = new Date(); Obtener la fecha actual del dispositivo todo
    let filteredData : Appointment[] | undefined = undefined;
    let markedDatesArray : string[] = [];
    if(appointments){
        filteredData = appointments.filter(item => {
            return item.date === targetDate;
        });
        markedDatesArray = appointments.map(item => item.date.toString());
        //markedDates tiene q tener el mes q este mostrando el calender, bha nose q pasaria si tiene días q ni esta mostrando, pero calculo q estria mal todo
    }


    const markedDates = markedDatesArray.reduce<{ [key: string]:
            { marked: boolean, dotColor: string } }>((acc, date) => {
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
        <View style={{height: '100%'}}>
            <Calendar
            markingType={'custom'}
            markedDates={markedDates}
            />
            {/*TODO
             se tiene q trackear q fecha esta siendo seleccionada osea diferente a q fecha es hoy, (la q este seleccionada debe verse con un circulito marcada)
             al saber q fecha esta siendo seleccionada se recorre appointments y solo se muestra los q coincidan con la fecha seleccionada
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
                        {!markedDatesArray && <Text>markedDatesArray is undefined</Text>}

                        {filteredData && (
                            <>
                                <Text>Contenido de filteredData:</Text>
                                {filteredData.map((item, index) => (
                                    <Text key={index}>{item.date.toString()}</Text>
                                ))}
                            </>
                        )}

                        {markedDatesArray && (
                            <>
                                <Text>Contenido de markedDatesArray:</Text>
                                {markedDatesArray.map((date, index) => (
                                    <Text>{index}</Text>
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