import React, {useEffect, useState} from 'react';
import {View, Text, Alert, Image,  ScrollView, TouchableOpacity} from 'react-native';
import {supabase} from "../lib/supabase";
import {Appointment} from "../lib/types";
import TurnoContainer from "../components/TurnContainer";
// @ts-ignore
import {useTranslation} from "react-i18next";

import {styles} from '../assets/styles'
import ScrollableBg from "../components/ScrollableBg";
// @ts-ignore
import Squiggle from "../assets/tabAsset.png";
import {Icon} from "react-native-elements";

const Home: React.FC = ({navigation, route}: any) => {
    const session = route.params.session;
    const [first_name, setFirstName] = useState('')
    const [loading, setLoading] = useState(true)
    const [appointments, setAppointments] = useState<Appointment[] | undefined>(undefined)
    let turno1, turno2: Appointment | null = null;
    let date1, date2: Date | null = null;
    const {t} = useTranslation();

    //se tiene q orderna por fecha appointments todo

    if (appointments && appointments.length == 1) {
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
        if (session) getProfile()
        if (session) getAppointments()
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

    async function getAppointments() {
        const to_return: Appointment[] = [];
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data: user_id, error: user_data_error} = await supabase.rpc('get_independent_user_id')
            if (user_data_error)
                throw new Error(user_data_error.message);

            const {data, error, status} = await supabase.rpc('get_appointments', {user_id: user_id})
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                for (const appoint of data) {
                    try {
                        const {
                            data: user_data,
                            error: user_error
                        } = await supabase.rpc('get_user', {user_id: appoint.user})
                        const {data: doctor_data} = await supabase.rpc('get_doctor', {doctor_id: appoint.doctor})
                        if (user_error) {
                            throw user_error;
                        }
                        to_return.push({
                            id: appoint.id,
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
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle}/>
            <Text style={[styles.tabTitle, {paddingTop: 70}]}>
                {t('home')}
            </Text>
            <ScrollableBg>
                <Text style={styles.screenTitle}>{t('welcome')} {first_name}!</Text>
                <View style={{
                    height: 125,
                    marginTop: '5%',
                    marginLeft: '5%',
                    marginRight: '5%'
                }}>
                    <ScrollView horizontal={true} contentContainerStyle={{paddingRight: 175, flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.buttons} onPress={() => console.log('Doctores')}>
                            <Icon name={'stethoscope'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('doctors')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {backgroundColor: '#DEB0BD'}]}
                                          onPress={() => console.log('Doctores')}>
                            <Icon name={'needle'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('vaccines')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {backgroundColor: '#ECB761'}]}
                                          onPress={() => console.log('Doctores')}>
                            <Icon name={'pill'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('medication')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {backgroundColor: '#86ABBA'}]}
                                          onPress={() => console.log('Doctores')}>
                            <Icon name={'archive'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('files')}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Text style={styles.subtitles}>{t('appointments')}</Text>
                <Text style={styles.subtitles}>{t('turnos recomendados')}</Text>
            </ScrollableBg>
            {/*<ScrollView style={{width:'85%', marginLeft: "5%",  marginRight: "5%", height: "100%"}}>*/}
            {/*    <Pressable style={{marginTop: "3%"}}*/}
            {/*               onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}>*/}
            {/*        <View style={styles.turnoContainer}>*/}
            {/*            <View style={styles.card}>*/}
            {/*                <Text style={[styles.titleText, {justifyContent:'center'}]}>{t('text12')}</Text>*/}
            {/*            </View>*/}
            {/*            {turno1 && date1 ? (*/}
            {/*                    <View style={{padding: "2%"}}>*/}
            {/*                        <TurnoContainer*/}
            {/*                            turno={turno1}*/}
            {/*                            date={date1}*/}
            {/*                            styleExterior={[styles.turnoContainer, {backgroundColor: '#dcf1d8', padding: "2%"}]}*/}
            {/*                        />*/}
            {/*                        {turno2 && date2 ? (*/}
            {/*                            <TurnoContainer*/}
            {/*                                styleExterior={[styles.turnoContainer, {marginTop: "2%", backgroundColor: '#dcf1d8', padding: "2%"}]}*/}
            {/*                                date={date2}*/}
            {/*                                turno={turno2}*/}
            {/*                            />*/}
            {/*                        ) : (<View/>) }*/}
            {/*                    </View>*/}
            {/*                    ) : (*/}
            {/*                    <View style={styles.turnoContainer}>*/}
            {/*                        <Text style={styles.text}>{t('text13')}</Text>*/}
            {/*                        <Text style={[styles.text, {fontStyle: 'italic'}]}>{t('text14')}</Text>*/}
            {/*                    </View>*/}
            {/*            )}*/}
            {/*        </View>*/}
            {/*    </Pressable>*/}
            {/*    <Pressable style={{marginTop: "5%"}}>*/}
            {/*        <View style={styles.turnoContainer}>*/}
            {/*            <View style={styles.card}>*/}
            {/*                <Text style={[styles.titleText, {justifyContent:'center'}]}>{t('text15')}</Text>*/}
            {/*            </View>*/}
            {/*            <Text style={[styles.text]}>Esperar la aplicación de la IA porfavor :)</Text>*/}
            {/*        </View>*/}
            {/*    </Pressable>*/}
            {/*</ScrollView>*/}
        </View>
    )
        ;
}
//
// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: "#E9F4E9",
//         height: '100%',
//     },
//     col: {
//         flex: 1,
//         flexDirection: 'column',
//         justifyContent: 'center',
//     },
//     titleText: {
//         fontFamily: 'Roboto-Thin',
//         fontSize: 20,
//         textAlign: 'center',
//         fontWeight: 'bold',
//         marginTop: "1%",
//         color: "#2E5829",
//     },
//     text: {
//         fontSize: 20,
//         textAlign: 'left',
//         color: "#2E5829",
//         fontFamily: 'Roboto-Thin',
//         margin: "4%"
//     },
//     card: {
//         backgroundColor: '#B7DAB1',
//         padding: 10,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         elevation: 3,
//         height: 45
//     },
//     img: {
//         height: 150,
//         borderTopRightRadius: 10,
//         borderTopLeftRadius: 10,
//     },
//     turnoContainer: {
//         backgroundColor: '#CBE4C9',
//         borderRadius: 20,
//         borderColor: '#CBE4C9',
//         borderWidth: 1,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.85,
//     },
//     logo:{
//         color: '#407738',
//         width: 50,
//         height: 50,
//
//     },
//     topContent: {
//         alignItems: 'flex-start',
//         marginTop: "8%",
//         marginLeft: "6%"
//     },
//     centerContent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: "30%"
//     },
//     screenTitle: {
//         fontFamily: 'Roboto-Thin',
//         fontSize: 25,
//         textAlign: 'center',
//         fontWeight: 'bold',
//         marginTop: "1%",
//         color: "#2E5829FF",
//     }
// });

export default Home;
