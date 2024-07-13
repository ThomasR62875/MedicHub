import React, {useEffect, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Divider} from "react-native-paper";
import {deleteAppointment, getDoctor, getUserData} from "../lib/supabase";
import {Doctor} from "../lib/types";
import {recommendQuestionsForAppointment} from "../lib/openai";
import {styles} from "../assets/styles";
// @ts-ignore
import Header from "../assets/header_green.png";
import ScrollableBg from '../components/ScrollableBg';

type SingleAppointmentProps = NativeStackScreenProps<RootStackParamList, 'SingleAppointment'>

const SingleAppointment: React.FC<SingleAppointmentProps> = ({ navigation, route }: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
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
        try {
            const session = route.params.session;
            console.log("Esta es el id del appointments: ", route.params.appointment.id);
            const {message} =  await deleteAppointment(route.params.appointment.id);

            Alert.alert(message,'',[{text: 'Ok', onPress: () => navigation.navigate(t('calendar'), {session: session})}])

        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
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
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(203,214,144,0.6)'}]}>
                <View style={{flexDirection: 'row', marginHorizontal:'10%', marginVertical:'20%', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'} style={styles.back_arrow}
                          onPress={() => navigation.navigate('HomeTabs')}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {backgroundColor: 'rgba(203,214,144,0.6)', alignSelf: 'center'}]} name={'calendar-month-outline'} type={'material-community'}/>
                    <Icon
                        name='pencil'
                        iconStyle={{color: '#fff'}}
                        type='ionicon'
                        size={25}
                        onPress={() => navigation.navigate('EditAppointment', {appointment: route.params.appointment})}
                    />
                </View>
            </View>
            <ScrollableBg>
                <Text style={styles.titleText}>{route.params.appointment.description}</Text>
                <Divider style={styles.divider}></Divider>

                <View style={{padding: '10%'}}>
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
                        <Text style={styles.label}>{t('observations')}:</Text>
                        <Text style={styles.value}>{route.params.appointment.observations}</Text>
                    </View>
                    <View style={styles.screen}>
                        <View style={{alignItems: 'center', width: 'auto'}}>
                            <PaperButton
                                mode="outlined"
                                style={{borderRadius: 15, borderColor: '#CBD690FF', marginTop: '10%', width: '70%'}}
                                textColor='#000'
                                labelStyle={{textAlign: 'left', display: 'flex'}}
                                onPress={() => handlePressRecommendQuestionsForAppointment()}>
                                {t('ai')}
                            </PaperButton>
                            <Button
                                title={t('delete')}
                                buttonStyle={{
                                    backgroundColor: '#CBD690',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                    minHeight: 50,
                                    minWidth: 150,
                                }}
                                containerStyle={{
                                    width: 150,
                                    marginHorizontal: 50,marginVertical: '10%',
                                    marginBottom:100
                                }}
                                titleStyle={{ color: '#fff' }}
                                onPress={() => showDialog()}
                            />
                        </View>
                    </View>
                </View>
            </ScrollableBg>

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
                        {t('cancel')}
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteAppointment}>
                        {t('delete')}
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>

    );
};

export default SingleAppointment;