import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog} from "react-native-paper";
import {deleteAppointment, deleteDoctor, getDoctor} from "../lib/supabase";
import {Doctor} from "../lib/types";
import {UserData} from "../lib/types";
import {recommendQuestionsForAppointment} from "../lib/openai";

type SingleAppointmentProps = NativeStackScreenProps<RootStackParamList, 'SingleAppointment'>

const SingleAppointment: React.FC<SingleAppointmentProps> = ({ navigation, route }: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
    // Convert date to desired format
    const originalDate = new Date(route.params.appointment.date);
    const formattedDate = `${originalDate.getDate()}/${originalDate.getMonth() + 1}/${originalDate.getFullYear()}`;
    const formattedTime = `${(originalDate.getHours() + 3) % 24}:${originalDate.getMinutes().toString().padStart(2, '0')}`;
    const {t} = useTranslation();
    const [doctor, setDoctor] = useState<Doctor | undefined>()
    const [recommendation, setRecommendation] = useState<string>('');

    useEffect(() => {
        const fetchDoctor = async () => {
            const doctorData = await getDoctor(route.params.appointment.doctor);
            setDoctor(doctorData);
        };
        fetchDoctor();
    }, [route.params.appointment.doctor])


    const handleDeleteAppointment = async () => {
        const session =  route.params.session;
        const appointment =  route.params.appointment;
        const result = await deleteAppointment(appointment);
        navigation.navigate('Appointments', { session: session })
    };

    const handlePressRecommendQuestionsForAppointment = async () => {
        const data = await getUserData(route.params.appointment);
        console.log(data);
        if (data) {
            const prompt = t('questionPromptP1');
            const lastAppointmentText = t('lastAppointmentText', {
                specialty: data.lastAppointment.specialty,
                date: data.lastAppointment.date,
                observations: data.lastAppointment.observations
            });
            const demographicInfo = t('demographicInfo', {
                sex: data.medicalInfo.sex,
                age: data.medicalInfo.age ?? null
            });
            const response = await recommendQuestionsForAppointment(prompt, lastAppointmentText, demographicInfo);
            setRecommendation(response ?? '');
            console.log(response);
        } else {
            console.error('Failed to get user data.');
        }
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{t('text4')}</Text>
            </View>
            <View style={styles.addContainer}>
                <Icon
                    name='pencil'
                    iconStyle={{ color: '#1E3A1AFF' }}
                    type='ionicon'
                    size={25}
                    style={{margin: "10%"}}
                    onPress={() => navigation.navigate('EditAppointment', {appointment: route.params.appointment})}
                />
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('user')}:</Text>
                <Text style={styles.value}>{route.params.appointment.user_name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('date')}:</Text>
                <Text style={styles.value}>{formattedDate}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('time')}:</Text>
                <Text style={styles.value}>{formattedTime}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('doc')}:</Text>
                <Text style={styles.value}>{doctor ? `${doctor.name} (especialidad: ${doctor.specialty})` : 'Sin datos de doctor'}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('description')}:</Text>
                <Text style={styles.value}>{route.params.appointment.description}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('observations')}:</Text>
                <Text style={styles.value}>{route.params.appointment.observations}</Text>
            </View>
            <View style={styles.screen}>
                <View style={{alignItems: 'center', width: 'auto'}}>
                    <Button
                        title="Preguntar IA"
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50,
                            minWidth: 150,
                        }}
                        containerStyle={{
                            width: 150,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            marginBottom:100
                        }}
                        titleStyle={{ color: '#eef9ed' }}
                        onPress={() => handlePressRecommendQuestionsForAppointment()}
                    />
                    <Button
                        title="Eliminar"
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50,
                            minWidth: 150,
                        }}
                        containerStyle={{
                            width: 150,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            marginBottom:100
                        }}
                        titleStyle={{ color: '#eef9ed' }}
                        onPress={() => showDialog()}
                    />
                </View>
            </View>
            <Dialog style={styles.dialog}
                    visible={visible}
                    onDismiss={hideDialog}>
                <Dialog.Content>
                    <Text style={[{textAlign: 'center'}, {fontSize: 18}]}>
                        {t('RUsureA')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        Cancelar
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteAppointment}>
                        Eliminar
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default SingleAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e9f4e9',
    },
    titleContainer: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    },
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
    dialog:{
        backgroundColor: '#E9F4E9FF',

    }
});
