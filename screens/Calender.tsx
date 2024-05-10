import React, {useEffect, useState} from "react";
import {Alert, Dimensions, ScrollView, StyleSheet, Text, View} from "react-native";
import {Appointment} from "./Appointments";
import {Calendar} from "react-native-calendars";
import AddButton from "../components/AddButton";
import TurnoContainer from "../components/TurnContainer";
import {supabase} from "../lib/supabase";

const Calender: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)

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
            <Calendar
            markingType={'custom'}
            markedDates={AllMarkedDays}
            onDayPress={handleDayPress}
            theme={customTheme}
            />
            <ScrollView>
                {filteredData && filteredData.length > 0 ? (
                    filteredData.map((turno: Appointment, i: number) => {

                        return(
                            <View key={i} style={{alignItems: 'center', marginTop: 10}}>
                                <TurnoContainer
                                    date={turno.date}
                                    turno={turno}
                                    styleExterior={styles.turnoContainer}
                                />
                            </View>
                        )
                        })) :  (
                            <View style={{alignItems: 'center', marginTop: 10}}>
                                <View style={[styles.turnoContainer, {padding: 10}]}>
                                    <Text style={styles.text}>No hay turnos este día</Text>
                                    <Text style={[styles.text, {fontStyle: 'italic'}]}>Presiona el + para crear un turno el {dateNormal}</Text>
                                </View>
                            </View>
                        )}
                <View style={{alignItems: 'center', marginTop: 10}}>
                    <AddButton onPress={() => navigation.navigate('AddAppointment', {session})} />
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
        fontSize: 18,
        textAlign: 'center',
    },
    turnoContainer: {
        backgroundColor: '#D6EFD4',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        borderColor: 'black',
        borderWidth: 1,
        width: '90%',
    },
    container: {
        height: '100%',
        marginTop: screenHeight * 0.1,
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