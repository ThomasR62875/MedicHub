import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, TouchableOpacity} from 'react-native';
import {
    getAge,
    getAppointmentInterval,
    getAppointments,
    getDependentUsers,
    getDoctor,
    getRecommendationSpecialities,
    getUserSession
} from "../lib/supabase";
import {Appointment, DependentUser, RecommendationAppointment, Specialty} from "../lib/types";
import TurnoContainer from "../components/TurnoContainer";
import RecommendationAppointmentContainer from "../components/RecommendationAppointmentContainer";
// @ts-ignore
import {useTranslation} from "react-i18next";
import {styles} from '../assets/styles'
import ScrollableBg from "../components/ScrollableBg";
// @ts-ignore
import Squiggle from "../assets/tabAsset.png";
import {Icon} from "react-native-elements";

const Home: React.FC = ({ navigation, route }: any) => {
    const session = route.params.session;
    const [first_name, setFirstName] = useState('');
    const [appointments, setAppointments] = useState<Appointment[] | undefined>(undefined);
    const [appointmentRecommendations, setAppointmentRecommendations] = useState<RecommendationAppointment[] | undefined>(undefined);
    const [lastAppointments, setLastAppointments] = useState<Appointment[] | undefined>(undefined);
    const [futureAppointments, setFutureAppointments] = useState<Appointment[] | undefined>(undefined);
    const [turno1, setTurno1] = useState<Appointment | null>(null);
    const [turno2, setTurno2] = useState<Appointment | null>(null);
    const [date1, setDate1] = useState<Date | null>(null);
    const [date2, setDate2] = useState<Date | null>(null);
    const [specialties, setSpecialties] = useState<Specialty[] | null>(null);
    const [allUsers, setAllUsers] = useState<DependentUser[] | undefined>(undefined);
    const { t } = useTranslation();

    useEffect(() => {
        if (session) {
            async function fetchData() {
                try {
                    const user = await getUserSession(session.user.id);
                    setFirstName(user.first_name);

                    const dependentUsers = await getDependentUsers(session.id);
                    const updatedUsers = dependentUsers ? [...dependentUsers] : [];
                    if (!dependentUsers?.some(u => u.id === user.id)) {
                        updatedUsers.push(user);
                    }
                    setAllUsers(updatedUsers);

                    const fetchedAppointments = await getAppointments();
                    setAppointments(fetchedAppointments);

                    const fetchedSpecialties = await getRecommendationSpecialities();
                    // @ts-ignore
                    setSpecialties(fetchedSpecialties);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            fetchData();
        }
    }, [session]);

    useEffect(() => {
        if (appointments && appointments.length > 0) {
            const sortedAppointments = [...appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTurno1(sortedAppointments[0]);
            setDate1(new Date(sortedAppointments[0].date));
            if (sortedAppointments.length > 1) {
                setTurno2(sortedAppointments[1]);
                setDate2(new Date(sortedAppointments[1].date));
            }
        }
    }, [appointments]);

    useEffect(() => {
        if (appointments) {
            classifyAppointments(appointments);
        }
    }, [appointments]);

    useEffect(() => {
        if (allUsers && specialties) {
            getRecommendations();
        }
    }, [allUsers, specialties]);

    const classifyAppointments = (appointments: Appointment[]) => {
        const lastAppointments: Appointment[] = [];
        const futureAppointments: Appointment[] = [];

        const today = new Date();

        appointments.forEach(appointment => {
            const appointmentDate = new Date(appointment.date);

            if (appointmentDate >= today) {
                futureAppointments.push(appointment);
            }

            if (appointmentDate < today) {
                lastAppointments.push(appointment);
            }
        });

        setLastAppointments(lastAppointments);
        setFutureAppointments(futureAppointments);
    };

    const getRecommendations = async () => {
        const recommendations: RecommendationAppointment[] = [];

        for (const user of allUsers!) {
            for (const speciality of specialties!) {
                const hasFutureAppointment = futureAppointments?.some(async appointment => {
                    const doctor = await getDoctor(appointment.doctor);
                    return (
                        appointment.user_id === user.id &&
                        doctor.specialty === speciality.name
                    );
                });

                if (!hasFutureAppointment) {
                    const hasLastAppointments = lastAppointments?.filter(async appointment => {
                        const doctor = await getDoctor(appointment.doctor);
                        return (
                            appointment.user_id === user.id &&
                            doctor.specialty === speciality.name
                        );
                    });

                    if (hasLastAppointments && hasLastAppointments.length > 0) {
                        hasLastAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                        const lastAppointment = hasLastAppointments[0];

                        try {
                            const interval = await getAppointmentInterval(speciality, getAge(user.birthdate), user.sex);
                            if (interval !== null) {
                                const nextAppointmentDate = new Date(lastAppointment.date);
                                nextAppointmentDate.setDate(nextAppointmentDate.getDate() + interval);

                                const twoDaysFromNow = new Date();
                                twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

                                if (nextAppointmentDate < new Date()) {
                                    nextAppointmentDate.setDate(twoDaysFromNow.getDate());
                                }

                                const threeMonthsFromNow = new Date();
                                threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + 90);

                                if(user.first_name == "mi hijo" && speciality.name == "Pediatría"){
                                    console.log("-------------")
                                    console.log("lastAppointment", lastAppointment);
                                    console.log("interval", interval);
                                    console.log("nextAppointmentDate", nextAppointmentDate);
                                    console.log("-------------")


                                }

                                if (nextAppointmentDate <= threeMonthsFromNow) {
                                    recommendations.push({
                                        date: nextAppointmentDate,
                                        user_name: user.first_name,
                                        doctor: lastAppointment.doctor,
                                        user_id: user.id,
                                        speciality: speciality.name
                                    });
                                }
                            } else {
                                console.error('El intervalo de cita es null o no se pudo obtener.');
                            }
                        } catch (error) {
                            console.error('Error al obtener el intervalo de cita:', error);
                        }
                    } else {
                        const newAppointmentDate = new Date();
                        newAppointmentDate.setDate(newAppointmentDate.getDate() + 2);

                        recommendations.push({
                            date: newAppointmentDate,
                            user_name: user.first_name,
                            doctor: '',
                            user_id: user.id,
                            speciality: speciality.name
                        });
                    }
                }
            }
        }

        setAppointmentRecommendations(recommendations);
    };


    // @ts-ignore
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


                <View style={[styles.listCards]}>
                    {appointmentRecommendations && appointmentRecommendations?.length > 0 ? (
                        appointmentRecommendations.map((appointment: RecommendationAppointment, i) => {
                            return (
                                <View key={i}>
                                    <RecommendationAppointmentContainer
                                        recommendationAppointment={appointment}
                                        styleExterior={[styles.cards]}
                                        onPress={() => {navigation.navigate('SingleAppointment', {session: session, appointment: appointment})}}

                                    />
                                </View>
                            )})
                    ) : (
                        <View style={{alignItems: 'center'}}>
                            <Text style={[styles.text2, {paddingHorizontal: 30}]}>{t('text13')}</Text>
                        </View>
                    )}
                </View>



            </ScrollableBg>
        </View>
    )
        ;
}

export default Home;