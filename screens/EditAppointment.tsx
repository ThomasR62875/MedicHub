import React, {useEffect, useState} from 'react';
import {getAllDoctorsByUser, getAllUsers, getUserId, updateAppointment} from '../lib/supabase';
import {
    View,
    Text,
    Alert,
    Platform
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../App';
import {DependentUser} from '../lib/types';
import {Doctor} from '../lib/types';
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {styles} from "../assets/styles";
import ScrollableBg from "../components/ScrollableBg";
import {validateTextLength} from "../lib/ourlibrary";

type EditAppointmentProps = NativeStackScreenProps<RootStackParamList, 'EditAppointment'>;

const EditAppointment: React.FC<EditAppointmentProps> = ({navigation, route}: any) => {
    const {session, appointment} = route.params;
    const [id, setId] = useState('')
    const [description, setDescription] = useState('');
    const [observations, setObservations] = useState('');
    const [doctor, setDoctor] = useState('Médico');
    const [user_id, setUserId] = useState('');
    const [session_user_id, setSessionUserId] = useState('');
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>([]);
    const [doctors, setDoctors] = useState<Doctor[] | undefined>([]);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [doctorDialog, setDoctorDialog] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('');
    const [observationsErrorMessage, setObservationsErrorMessage] = useState('');
    const descriptionLength= 30;
    const observationsLength= 100;
    const {t} = useTranslation();

    useEffect(() => {
        if (session) {
            const fetchAppointment = async () => {
                try {
                    if (appointment) {
                        setId(appointment.id);
                        setDescription(appointment.description);
                        setDoctor(appointment.doctor);
                        setUserId(appointment.user_id);
                        setDate(new Date(appointment.date));
                        setTime(new Date(appointment.date));
                        setObservations(appointment.observations);
                    }
                } catch (error) {
                    console.error("Error fetching appointment details:", error);
                }
            };
            fetchAppointment();
        }
    }, [session, route.params.appointment]);
    const validateDescription = (value: string) => {
        if (value.trim() === '') {
            setDescriptionErrorMessage(t('text7'));
        } else {
            let {result,msg}= validateTextLength(value,descriptionLength);
            setDescriptionErrorMessage(msg);
        }
    };

    const validateObservations = (value:string) =>{
        let {result,msg}= validateTextLength(value,observationsLength);
        setObservationsErrorMessage(msg);
    }

    useEffect(() => {
        if (session) {
            async function fetchUserId() {
                setSessionUserId(await getUserId());
            }

            fetchUserId();
        }
    }, [session]);

    useEffect(() => {
        if (session_user_id) {
            async function getInfo() {
                setDoctors(await getAllDoctorsByUser(session_user_id));
                setAllUsers(await getAllUsers(session_user_id));
            }

            getInfo();
        }
    }, [session_user_id]);

    useEffect(() => {
        if (
            doctor.trim() !== '' &&
            user_id.trim() !== '' &&
            descriptionErrorMessage == '' &&
            observationsErrorMessage == ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [description,doctor,user_id,observations]);


    const handleUpdateAppointment = async () => {
        const session = route.params.session;
        const appointmentDate = new Date(date);
        appointmentDate.setHours(time.getHours());
        appointmentDate.setMinutes(time.getMinutes())

        const appointment = {
            id: id, date: appointmentDate, description: description,
            user_name: '', doctor: doctor, user_id: user_id, observations: observations
        }
        const result = await updateAppointment(appointment);
        if (result.success) {
            navigation.navigate('AlertPublicity', {
                session,
                msg: 'editAppoint',
                screen: 'SingleAppointment',
                appointment: appointment
            });
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const doctorsList = doctors?.map((doctor) => ({
        label: doctor.name,
        value: doctor.id,
    }));

    const userList = all_users?.map((user) => ({
        label: user.first_name,
        value: user.id,
    }));

    const hideDoctorDialog = () => setDoctorDialog(false);
    const hideUserDialog = () => setUserDialog(false);

    const getDoctorName = (id: string) => {
        const selectedDoctor = doctors?.find(doc => doc.id === id);
        return selectedDoctor ? selectedDoctor.name : cutStringAtParenthesis(route.params.appointment.doctor);
    };

    const getUserName = (id: string) => {
        const selectedUser = all_users?.find(user => user.id === id);
        return selectedUser ? selectedUser.first_name : 'Seleccione un usuario';
    };

    function cutStringAtParenthesis(str: string): string {
        let parenthesisIndex = str.indexOf('(');
        if (parenthesisIndex !== -1) {
            return str.substring(0, parenthesisIndex);
        } else {
            return str;
        }
    }

    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const onTimeChange = (event: any, selectedTime: Date | undefined) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
    };

    const getDate = () => {
        return date ? date.toLocaleDateString() : 'Seleccione una fecha';
    };

    const getTime = () => {
        return time ? time.toLocaleTimeString() : 'Seleccione una hora';
    };

    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(203,214,144,0.6)'}]}>
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: '10%',
                    marginVertical: '20%',
                    alignItems: 'flex-start',
                }}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'}
                          style={styles.back_arrow}
                          onPress={() => navigation.navigate('SingleAppointment', {appointment: route.params.appointment})}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {
                        backgroundColor: 'rgba(203,214,144,0.6)',
                        alignSelf: 'center',
                        marginHorizontal: '35%'
                    }]} name={'calendar-month-outline'} type={'material-community'}/>

                </View>
            </View>
            <ScrollableBg style={{padding: '10%'}}>
                <Input
                    label={t('title')}
                    placeholder={t('title')}
                    value={description}
                    autoCapitalize={'none'}
                    onChangeText={(text) => {
                        setDescription(text);
                        validateDescription(text);
                    }}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={descriptionErrorMessage}
                />
                <Input
                    label={t('observations')}
                    placeholder={t('observations')}
                    value={observations}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    onChangeText={(text) => {
                        setObservations(text);
                        validateObservations(text);
                    }}
                    autoCapitalize={'none'}
                    errorStyle={{color: 'red'}}
                    errorMessage={observationsErrorMessage}
                />
                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t('dateTime')}</PaperText>
                <View style={styles.datePickerContainer}>
                    {Platform.OS === 'ios' ? (
                        <>
                            <DateTimePicker
                                testID="datePicker"
                                value={date}
                                minimumDate={new Date()}
                                mode="date"
                                display="default"
                                style={{backgroundColor: 'transparent'}}
                                onChange={onDateChange}
                            />
                            <DateTimePicker
                                testID="timePicker"
                                value={time}
                                mode="time"
                                display="default"
                                textColor='#cbe4c9'
                                onChange={onTimeChange}
                                timeZoneOffsetInMinutes={0}
                            />
                        </>
                    ) : (
                        <>
                            <PaperButton mode="outlined"
                                         style={[styles.input, {
                                             padding: 5,
                                             marginHorizontal: '3.5%',
                                             marginBottom: '5%'
                                         }]}
                                         textColor='#000'
                                         labelStyle={{textAlign: 'left', display: 'flex'}}
                                         contentStyle={{justifyContent: 'flex-start'}}
                                         onPress={() => setShowDatePicker(true)}>
                                {getDate()}
                            </PaperButton>
                            <PaperButton mode="outlined"
                                         style={[styles.input, {
                                             padding: 5,
                                             marginHorizontal: '3.5%',
                                             marginBottom: '5%'
                                         }]}
                                         textColor='#000'
                                         labelStyle={{textAlign: 'left', display: 'flex'}}
                                         contentStyle={{justifyContent: 'flex-start'}}
                                         onPress={() => setShowTimePicker(true)}>
                                {getTime()}
                            </PaperButton>
                            {showDatePicker && (
                                <DateTimePicker
                                    testID="datePicker"
                                    value={date}
                                    minimumDate={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                            {showTimePicker && (
                                <DateTimePicker
                                    testID="timePicker"
                                    value={time}
                                    mode="time"
                                    display="default"
                                    onChange={onTimeChange}
                                />
                            )}
                        </>
                    )}
                </View>
                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t('doc')}</PaperText>
                <PaperButton mode="outlined"
                             style={[styles.input, {padding: 5, marginHorizontal: '3.5%', marginBottom: '5%'}]}
                             textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                             contentStyle={{justifyContent: 'flex-start'}} onPress={() => setDoctorDialog(true)}>
                    {getDoctorName(doctor)}
                </PaperButton>
                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t('user')}</PaperText>
                <PaperButton mode="outlined"
                             style={[styles.input, {padding: 5, marginHorizontal: '3.5%', marginBottom: '5%'}]}
                             textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                             contentStyle={{justifyContent: 'flex-start'}} onPress={() => setUserDialog(true)}>
                    {getUserName(user_id)}
                </PaperButton>
                <View style={{alignItems: 'center'}}>
                    <Button
                        title={t('savec')}
                        buttonStyle={{
                            backgroundColor: '#cbd690',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            alignContent: 'center'
                        }}
                        titleStyle={{color: '#fff'}}
                        disabled={isButtonDisabled}
                        onPress={handleUpdateAppointment}
                    />
                </View>
            </ScrollableBg>
            <Portal>
                <Dialog style={styles.dialog} visible={doctorDialog} onDismiss={hideDoctorDialog}>
                    <Text style={styles.dialogTitle}>{t('selectDoctor')}</Text>
                    <Picker
                        mode='dropdown'
                        selectedValue={doctor}
                        onValueChange={(value: string) => setDoctor(value)}
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {doctorsList?.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value}/>
                        ))}
                    </Picker>
                </Dialog>
                <Dialog style={styles.dialog} visible={userDialog} onDismiss={hideUserDialog}>
                    <Text style={styles.dialogTitle}>{t('selectUser')}</Text>
                    <Picker
                        mode='dropdown'
                        selectedValue={user_id}
                        onValueChange={(value: string) => setUserId(value)}
                        placeholder={t('user')}
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {userList?.map((item) => (
                            <Picker.Item key={item.value} label={item.label} value={item.value}/>
                        ))}
                    </Picker>
                </Dialog>
            </Portal>
        </View>
    );
};

export default EditAppointment;