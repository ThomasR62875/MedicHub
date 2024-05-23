import React, {useEffect, useState} from "react";
import {Alert, Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {Appointment} from "./Appointments";
import {Calendar} from "react-native-calendars";
import TurnoContainer from "../components/TurnContainer";
import {getAppointments} from "../lib/supabase";
import {Button} from "react-native-elements";

const Calender: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    useEffect(() => {
        if (session) {
            async function fetchData() {
                setAppointments(await getAppointments())
            }  
            fetchData()
        }
    }, [session])

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const stringDay = day.toString();
        return `${year}-${month}-${stringDay}`;
    };
    const currentDate = getCurrentDate(); //es necesario porq no le gusta a AllMarkedDays q currentDate sea una funcion
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const handleDayPress = ({ dateString }: { dateString: string }) => {
        setSelectedDate(dateString);
    };

    let targetDate = selectedDate;
    let parts = targetDate.split('-');
    let dateNormal = `${parts[2]}-${parts[1]}-${parts[0]}`;
    let filteredData : Appointment[] | undefined = undefined; //es un array donde se guardan todos los appointments los cuales su date coinciden con el día seleccionado en el calendario (targeDate)
    let markedDates : string[] = []; //Es un array donde se guardan todos los dates de appointments, en formato string YYYY-MM-DD porq es lo q usa el calendar
    if(appointments){
        filteredData = appointments.filter(item => {
            return item.date.toString().slice(0,10) === targetDate;
        });
        markedDates = appointments.map(item => item.date.toString().slice(0,10));
    }
    const markedDatesString = markedDates.reduce<{ [key: string]:
            { marked: boolean, dotColor: string } }>((acc, date) => {
        acc[date] = { marked: true, dotColor: '#48B445' };
        return acc;
    }, {});

    const AllMarkedDays ={
        ...markedDatesString,
        [currentDate]: {
        },
        [selectedDate]: {
            selected: true,
            selectedColor: '#073A29',
            ...(markedDatesString[selectedDate] || {})
        },
        //acá faltaria agregar para que se marquen los días de toma de medicamentos, esto lo hariamos con "period"s todo
    }

    const customTheme = {
        arrowColor: '#00A36C',
        todayTextColor: '#00A36C',
    }

    return (
        <View style={styles.container}>
            <View style={styles.window}>
                <Text style={styles.screenTitle}>Calendar</Text>
            </View >
            <View style={styles.calendarContainer}>
                <Calendar style={{borderRadius: 10}}
                markingType={'custom'}
                markedDates={AllMarkedDays}
                onDayPress={handleDayPress}
                theme={customTheme}
                />
            </View>
            <ScrollView centerContent={true} >
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((turno: Appointment, i: number) => {

                        return(
                            <View key={i} style={{alignItems: 'center', marginTop: 10}}>
                                <TurnoContainer
                                    date={turno.date}
                                    turno={turno}
                                    styleExterior={styles.turno}
                                />
                            </View>
                        )
                        })) :  (
                            <View style={{alignItems: 'center', marginTop: 10}}>
                                <View style={[styles.turnoContainer]}>
                                    <Text style={styles.text}>No hay turnos para el {dateNormal}</Text>
                                </View>
                            </View>
                        )}
                <View style={{alignItems: 'center', marginTop: 10, marginLeft: "10%", marginBottom: "20%", alignContent: 'center'}}>
                    <Button
                        title="Agregar turno"
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderColor: 'white',
                            borderRadius: 20,
                            minHeight: 10,
                            width: "70%"
                        }}
                        titleStyle={{ color: '#E9F4E9FF',fontSize: 15, margin: 5 }}
                        onPress={() => navigation.navigate('AddAppointment', {session: session})}/>
                </View>
            </ScrollView>
        </View>
    )
}

const screenHeight = Dimensions.get('window').height;
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
        fontSize: 20,
        textAlign: 'center',
        marginTop: '5%',
        color: "#2E5829",
    },
    turnoContainer: {
        backgroundColor: '#CBE4C9FF',
        borderRadius: 5,
        width: '90%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        minHeight: 60
    },
    container: {
        height: '100%',
        backgroundColor: '#e9f4e9',
    },
    window: {
        alignItems: 'center',
        marginTop: '20%',
        marginLeft: '5%',
        marginRight: '5%'
    },
    calendarContainer: {
        margin: '5%',
        backgroundColor: "#E9F4E9FF"
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        marginBottom: "5%",
        color: "#2E5829FF",
        width: "60%"
    },
    turno: {
        backgroundColor: '#CBE4C9',
        borderRadius: 20,
        borderColor: '#CBE4C9',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
        padding: "2%",
    }
});

export default Calender;

/*
Esto lo use para encontrar errores, asiq queda acá por si se vuelve a necesitar

<View style={{marginTop:60}}>
                        {!filteredData && <Text>filteredData is undefined</Text>}
                        {filteredData && (
                            <>
                                <Text>Contenido de filteredData:</Text>
                                <Text>{filteredData.length}</Text>
                                {filteredData.map((item, index) => (
                                    <Text key={index}>{item.date.toString()}</Text>
                                ))}
                            </>
                        )}
                        {appointments && appointments.length > 0 ? (
                            <>
                                <Text> el targetDate {targetDate}</Text>
                                <Text>Contenido de appointments:</Text>
                                {appointments.map((item, index) => (
                                    <View key={index}>
                                        <Text>{item.date.toString().slice(0,10)} === {targetDate}</Text>
                                    </View>

                                ))}
                            </>
                        ) : (
                            <Text>No hay citas disponibles</Text>
                        )}
                    </View>
 */