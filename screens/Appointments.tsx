import React, { useState, useEffect } from 'react'
import {getAppointments} from '../lib/supabase'
import {StyleSheet,ScrollView ,View, Text} from 'react-native'
import AppointmentButton from "../components/AppointmentButton";
import {Button} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"

export type Appointment = {
    id: string;
    date: Date;
    description:string;
    user_name:string;
    doctor: string;
    user_id: string;
}
const Appointments: React.FC =  ({navigation, route}: any) =>{
    const session = route.params.session;
    const [loading, setLoading] = useState(true)
    const [appointments,setAppointments]= useState<Appointment[] | undefined>(undefined)
    const {t} = useTranslation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (session) {
                async function fetchData() {
                    // @ts-ignore
                    setAppointments(await getAppointments())
                }  
                fetchData()
            }
        });

        return unsubscribe;
    }, [navigation, session]);


    return(
        <View style={styles.container}>
            <View style={styles.window}>
                <View style={styles.topContent}>
                    <Text style={styles.titleText}>{t('mappointments')}</Text>
                    <Button
                        title={t('add')}
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderColor: 'white',
                            borderRadius: 20,
                            minHeight: 10,
                            minWidth: 10,
                        }}
                        titleStyle={{ color: '#E9F4E9',fontSize: 15, margin: 5 }}
                        onPress={() => navigation.navigate('AddAppointment', {session: session})}/>
                </View>
                <ScrollView>
                        {appointments && appointments?.length > 0 ? (
                                appointments.map((appointment: Appointment, i) => {
                                return (
                                     <View key={i}>
                                         <AppointmentButton onPress={() => navigation.navigate({name: 'SingleAppointment', params: {appointment: appointment}})}
                                             date={appointment.date} turno={appointment}></AppointmentButton>
                                     </View>
                                )})
                            ) : (
                            <View style={[cardStyle.container]}>
                                <Text style={[cardStyle.text]}>{t('text13')}</Text>
                            </View>
                        )}
               </ScrollView>
            </View>
        </View>
    );
};

export default Appointments

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
    },
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "70%"
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
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    }
});