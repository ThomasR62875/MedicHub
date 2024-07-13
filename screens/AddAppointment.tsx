import React, { useEffect, useState } from 'react';
import {addAppointment, getAllDoctorsByUser, getAllUsers, getDoctorsBySpecialty, getUserId} from '../lib/supabase';
import {
    StyleSheet,
    Alert,
    View,
    TouchableWithoutFeedback,
    Text,
    ScrollView,
    Keyboard,
    SafeAreaView, Platform
} from 'react-native';
import {Button} from "react-native-elements";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import {DependentUser, RecommendationAppointment} from "../lib/types";
import { Doctor } from "../lib/types";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from "@react-native-picker/picker";
import { useTranslation } from "react-i18next";
import {TextInput, Text as PaperText, HelperText, Button as PaperButton, Dialog, Portal} from "react-native-paper";


type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'AddAppointment'>;

const AddAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }) => {
    const { session, recommendation }: { session?: any, recommendation?: RecommendationAppointment } = route.params ?? {};
    const [description, setDescription] = useState('');
    const [observations, setObservations] = useState('');
    const [doctor, setDoctor] = useState('Médico');
    const [user_id, setUserId] = useState('');
    const [session_user_id, setSessionUserId] = useState('');
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>([]);
    const [doctors, setDoctors] = useState<Doctor[] | undefined>([]);
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [doctorDialog, setDoctorDialog] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('');
    const { t } = useTranslation();
    const [hasErorrs, setHasErrors] = useState(false)

    const validateDescription = (value: string) => {
        if (value.trim() === '') {
            setDescriptionErrorMessage(t('text7'));
            setHasErrors(true);
        } else {
            setDescriptionErrorMessage('');
            setHasErrors(true);
        }
    };

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
                if (recommendation) {
                    recommendation.date = new Date(recommendation.date);
                    setDoctors(await getDoctorsBySpecialty(session_user_id, recommendation.specialty));
                    setDate(recommendation.date);
                    setTime(recommendation.date);
                    setUserId(recommendation.user_id);
                    setDoctor(recommendation.doctor);
                    setDescription(t('addRecommendationAppointmentDescription') + t(recommendation.specialty))
                } else {
                    setDoctors(await getAllDoctorsByUser(session_user_id));
                }
                setAllUsers(await getAllUsers(session_user_id));
            }
            getInfo();
        }
    }, [session_user_id]);

    useEffect(() => {
        if (
            doctor.trim() !== '' &&
            user_id.trim() !== '' &&
            description !== ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [doctor, user_id, description]);


    const handleAddAppointment = async () => {
        const appointmentDate = new Date(date);
        console.log("pri: ", appointmentDate)
        appointmentDate.setHours(time.getHours()-3);
        console.log("seg: ", appointmentDate)

        const appointment = { date: appointmentDate, description, user_name: '', doctor, user_id, id: '', observations: observations};
        const result = await addAppointment(appointment);
        /*if (result.success) {
            // @ts-ignore
            //navigation.navigate('AlertPublicity', { session, msg: 'text8', screen: 'calendar', appointment: null, du: null, doc: null, meds: null  });
            //:( ni calendar ni Calender funcionan como screen xd
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }*/
    };

    const doctorsList = doctors?.map((doctor) => ({
        label: doctor.name,
        value: doctor.id,
    }));

    const userList = all_users?.map((user) => ({
        label: user.first_name,
        value: user.id,
    }));

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

    const hideDoctorDialog = () => setDoctorDialog(false);
    const hideUserDialog = () => setUserDialog(false);

    const getDoctorName = (id: string) => {
        const selectedDoctor = doctors?.find(doc => doc.id === id);
        return selectedDoctor ? selectedDoctor.name : t('select_doc');
    };

    const getUserName = (id: string) => {
        const selectedUser = all_users?.find(user => user.id === id);
        return selectedUser ? selectedUser.first_name : t('select_user');
    };

    const getDate = () => {
        return date ? date.toLocaleDateString() : 'Seleccione una fecha';
    };

    const getTime = () => {
        return time ? time.toLocaleTimeString() : 'Seleccione una hora';
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <ScrollView >
                    <View>
                        <View style={styles.topContent}>
                            <Text style={styles.titleText}>{t('adappointment')}</Text>
                        </View>
                        <View>
                            <TextInput
                                style={{backgroundColor: "#e9f4e9", marginTop: "10%", textAlign: 'center', marginLeft:'5%' , marginRight: '5%'}}
                                label={t('title')}
                                value={description}
                                onChangeText={(text) => {
                                    setDescription(text);
                                    validateDescription(text);
                                }}
                                mode='flat'
                                underlineColor='#2E5829FF'
                                activeUnderlineColor='#2E5829FF'
                            />
                            <TextInput
                                style={{backgroundColor: "#e9f4e9", marginTop: "10%", textAlign: 'center', marginLeft:'5%' , marginRight: '5%'}}
                                label={t('observations')}
                                value={observations}
                                onChangeText={(text) => {
                                    setObservations(text);
                                }}
                                mode='flat'
                                underlineColor='#2E5829FF'
                                activeUnderlineColor='#2E5829FF'
                            />
                            <HelperText type="error" visible={hasErorrs}>
                                {descriptionErrorMessage}
                            </HelperText>
                        </View>
                        <PaperText style={styles.text}>{t('dateTime')}:</PaperText>
                        <View style={styles.datePickerContainer}>
                            {Platform.OS === 'ios' ? (
                                <>
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={date}
                                        mode="date"
                                        display="default"
                                        style={{ backgroundColor: 'transparent' }}
                                        onChange={onDateChange}
                                    />
                                    <DateTimePicker
                                        testID="timePicker"
                                        value={time}
                                        mode="time"
                                        display="default"
                                        textColor='#cbe4c9'
                                        onChange={onTimeChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <PaperButton
                                        mode="outlined"
                                        style={styles.pickerButton}
                                        textColor='#2E5829'
                                        labelStyle={{ textAlign: 'left', display: 'flex' }}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        {getDate()}
                                    </PaperButton>
                                    <PaperButton
                                        mode="outlined"
                                        style={styles.pickerButton}
                                        textColor='#2E5829'
                                        labelStyle={{ textAlign: 'left', display: 'flex' }}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        {getTime()}
                                    </PaperButton>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            testID="datePicker"
                                            value={date}
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
                        <PaperText style={styles.text}>Doctor</PaperText>
                        <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setDoctorDialog(true)}>
                            {getDoctorName(doctor)}
                        </PaperButton>
                        <PaperText style={styles.text}>{t('user')}</PaperText>
                        <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setUserDialog(true)}>
                            {getUserName(user_id)}
                        </PaperButton>
                        <View style={{alignItems: 'center'}}>
                            <Button
                                title={t('add')}
                                disabled={isButtonDisabled}
                                buttonStyle={{
                                    backgroundColor: '#2E5829',
                                    borderWidth: 2,
                                    borderColor: 'white',
                                    borderRadius: 30,
                                    minHeight: 50
                                }}
                                containerStyle={{
                                    width: 150,
                                    marginHorizontal: 50,
                                    marginVertical: 10,
                                    marginTop: 40,
                                }}
                                titleStyle={{ color: '#eef9ed' }}

                                onPress={handleAddAppointment}
                            />
                        </View>
                    </View>
                </ScrollView>
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
                                <Picker.Item key={item.value} label={item.label} value={item.value} />
                            ))}
                        </Picker>
                    </Dialog>
                    <Dialog style={styles.dialog} visible={userDialog} onDismiss={hideUserDialog}>
                        <Text style={styles.dialogTitle}>{t('selectUser')}</Text>
                        <Picker
                            mode='dropdown'
                            selectedValue={user_id}
                            onValueChange={(value: string) => setUserId(value)}
                            placeholder='Usuario'
                            enabled={true}
                            itemStyle={styles.pickerStyle}
                        >
                            {userList?.map((item) => (
                                <Picker.Item key={item.value} label={item.label} value={item.value} />
                            ))}
                        </Picker>
                    </Dialog>
                </Portal>
            </SafeAreaView>
        </TouchableWithoutFeedback>

    );
}

export default AddAppointment;

const styles = StyleSheet.create({
    containerTotal: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        alignContent: 'center'
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
    pickerStyle: {
        marginBottom: 20,
    },
    topContent: {
        marginTop: '15%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 14,
        marginTop: "3%",
        marginLeft: '4%',
        marginBottom: '4%',
        color: "#2E5829FF",
        width: "60%"
    },
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "70%"
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
        height: '200%',
        display: 'flex'
    },
    window: {
        marginTop: "10%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    datePickerContainer: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '10%',
        marginRight: '15%',
        marginTop: '10%',
        marginBottom: '10%'
    },
    pickerButton: {
        borderRadius: 6,
        marginLeft: '5%',
        marginRight: '5%',
    },
    dialog: {
        backgroundColor: "#e9f4e9"
    },
    dialogTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        margin: "5%",
        marginLeft: '15%',
        color: "#2E5829FF",
        width: "70%"
    }
});
