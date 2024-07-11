import React, {useEffect, useState} from "react";
import { Image, Text, View} from "react-native";
import {Appointment} from "../lib/types";
import {Calendar} from "react-native-calendars";
import TurnoContainer from "../components/TurnContainer";
import {getAppointments} from "../lib/supabase";
import {Button} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {styles} from "../assets/styles";
// @ts-ignore
import Squiggle from "../assets/tabAsset.png";
import ScrollableBg from "../components/ScrollableBg";
import {Divider} from "react-native-paper";

const Calender: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const {t} = useTranslation();

    useEffect(() => {
        if (session) {
            async function fetchData() {
                setAppointments(await getAppointments())
            }  
            fetchData()
        }
        if (session) getAppointments()
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
        acc[date] = { marked: true, dotColor: '#8b86be' };
        return acc;
    }, {});

    const AllMarkedDays ={
        ...markedDatesString,
        [currentDate]: {
        },
        [selectedDate]: {
            selected: true,
            selectedColor: '#cbd690',
            ...(markedDatesString[selectedDate] || {})
        },
        //acá faltaria agregar para que se marquen los días de toma de medicamentos, esto lo hariamos con "period"s todo
    }

    const customTheme = {
        arrowColor: '#8b86be',
        todayTextColor: '#8b86be',
    }

    function formatDate(dateString: string | number | Date) {
        console.log(dateString)
        const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
        ];

        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        return `${day+1} de ${month}`;
    }

    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle}/>
            <Text style={[styles.tabTitle]}>
                {t('calendar')}
            </Text>
            <Text style={styles.screenTitle}>{t('subtitle_calendar')}</Text>
            <View style={styles.calendarContainer}>
                <Calendar style={{borderRadius: 10}}
                          markingType={'custom'}
                          markedDates={AllMarkedDays}
                          onDayPress={handleDayPress}
                          theme={customTheme}
                />
            </View>
            <Divider style={styles.divider}/>

            <ScrollableBg>
                <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
                    <Text style={[styles.text, {paddingVertical: 30, paddingHorizontal: 20}]}>{formatDate(selectedDate)}</Text>
                    <Button
                        title={t('add')+t('appo')}
                        buttonStyle={{
                            backgroundColor: '#86abba',
                            borderColor: 'white',
                            borderRadius: 15,
                            minHeight: 10,
                            width: "auto",
                            alignSelf: 'center',
                        }}
                        containerStyle={{padding: 20, marginHorizontal: '4%'}}
                        titleStyle={{ color: '#fff',fontSize: 15, margin: 5, fontWeight: 'bold'}}
                        onPress={() => navigation.navigate('AddAppointment', {session: session})}/>
                </View>
                <View style={{flexDirection: 'column'}}>
                    {filteredData && filteredData.length > 0 ? (
                        filteredData.map((turno: Appointment, i: number) => {
                            return(
                                <TurnoContainer
                                    date={turno.date}
                                    turno={turno}
                                    styleExterior={[styles.cards,{width: "85%", marginHorizontal: '5%'}]}
                                    onPress={() => {navigation.navigate('SingleAppointment', {session: session, appointment: turno})}}
                                />
                            )
                        })) :  (
                            <Text style={[styles.text2, {paddingVertical: 10, paddingHorizontal: 25}]}>{t('text13')}</Text>
                    )}
                </View>
            </ScrollableBg>
        </View>
    )
}

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