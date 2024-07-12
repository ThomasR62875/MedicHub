import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {getAppointments, getUserSession} from "../lib/supabase";
import {Appointment} from "../lib/types";
import TurnoContainer from "../components/TurnoContainer";
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
    const [appointments, setAppointments] = useState<Appointment[] | undefined>(undefined)
    const [turno1, setTurno1] = useState<Appointment | null>(null);
    const [turno2, setTurno2] = useState<Appointment | null>(null);
    const [date1, setDate1] = useState<Date | null>(null);
    const [date2, setDate2] = useState<Date | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        if (appointments && appointments.length > 0) {
            setTurno1(appointments[0]);
            setDate1(new Date(appointments[0].date));
            if (appointments.length > 1) {
                setTurno2(appointments[1]);
                setDate2(new Date(appointments[1].date));
            }
        }
    }, [appointments]);

    useEffect(() => {
        if (session) {

            async function fetchUser() {
                const user = await getUserSession(session?.user.id);
                setFirstName(user.first_name);
            }
            fetchUser();
        }
        if (session) {
            async function fetchData() {
                setAppointments(await getAppointments())
            }
            fetchData();
        }
        }, [session])

    /*
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
      const unsubscribe = navigation.addListener('focus', () => {
             fetchData()
          }
      });

      return unsubscribe;
  }, [session]);

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
                          observations: appoint.observaions
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
   */

    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle}/>
            <Text style={[styles.tabTitle]}>
                {t('home')}
            </Text>
            <ScrollableBg>
                <Text style={styles.screenTitle}>{t('welcome')} {first_name}!</Text>
                <View style={{
                    height: 125,
                    marginTop: '5%',
                }}>
                    <ScrollView horizontal={true} contentContainerStyle={{ paddingLeft: 20,paddingRight: 190, flexDirection: 'row'}}>
                        <TouchableOpacity style={[styles.buttons]} onPress={() => navigation.navigate({name: 'Doctors', params: {session: session}})}>
                            <Icon name={'stethoscope'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('doctors')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {backgroundColor: '#DEB0BD'}]}
                                          onPress={() => console.log('Vacunas')}>
                            <Icon name={'needle'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('vaccines')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {backgroundColor: '#ECB761'}]}
                                          onPress={() => navigation.navigate({name: 'Medications', params: {session: session}})}>
                            <Icon name={'pill'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('medication')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.buttons, {backgroundColor: '#86ABBA'}]}
                                          onPress={() => console.log('Archivos')}>
                            <Icon name={'archive'} type={'material-community'} size={25} color={'#fff'}/>
                            <Text style={styles.buttonText}>{t('files')}</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <Text style={styles.subtitles}>{t('text12')}</Text>
                <View style={[styles.listCards]}>
                    {turno1 && date1 ? (
                        <View>
                            <TurnoContainer
                                turno={turno1}
                                date={turno1.date}
                                styleExterior={[styles.cards]}
                                onPress={() => {navigation.navigate('SingleAppointment', {session: session, appointment: turno1})}}

                            />
                            {turno2 && date2 ? (
                                <TurnoContainer
                                    styleExterior={[styles.cards]}
                                    date={date2}
                                    turno={turno2}
                                    onPress={() => {navigation.navigate('SingleAppointment', {session: session, appointment: turno2})}}
                                />
                            ) : (<View/>)}
                        </View>
                    ) : (
                        <View style={{alignItems: 'center'}}>
                            <Text style={[styles.text2, {paddingHorizontal: 30}]}>{t('text13')}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.subtitles}>{t('text15')}</Text>
            </ScrollableBg>
        </View>
    );
}


export default Home;
