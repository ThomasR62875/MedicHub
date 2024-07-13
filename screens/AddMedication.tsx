import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Text as RNText, ScrollView, Platform
} from 'react-native';
import {addMedication} from "../lib/supabase";
import {Button, Input} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Medication} from '../lib/types';
import {useTranslation} from "react-i18next";
import {Picker} from '@react-native-picker/picker'
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import UnderlinedText from '../components/UnderlinedText';
import Checkbox from 'expo-checkbox';
import {cardStyle} from "../styles/global"
import {Button as PaperButton} from "react-native-paper";

type AddMedicationProps = NativeStackScreenProps<RootStackParamList, 'AddMedication'>

const AddMedication: React.FC<AddMedicationProps> = ({navigation, route}) => {
    const {session} = route.params;
    const [name, setName] = useState('')
    const [prescription, setPrescription] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [prescriptionErrorMessage, setPrescriptionErrorMessage] = useState('');
    const [dateSince, setDateSince] = useState(new Date());
    const [timeSince, setTimeSince] = useState(new Date());
    const [dateUntil, setDateUntil] = useState<Date >(new Date());
    const [howOften, setHowOften] = useState<Date | null>(null);
    const [isForever, setIsForever] = useState<boolean>(false);
    const [showDatePickerSince, setShowDatePickerSince] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePickerUntil, setShowDatePickerUntil] = useState(false);

    const {t} = useTranslation();
    const times = [
        '02:00:00',
        '04:00:00',
        '06:00:00',
        '08:00:00',
        '12:00:00'
    ];
    const timesList = times.map((time) => ({
        label: time,
        value: time,
    }));

    useEffect(() => {
        if (
            name.trim() !== '' &&
            prescription.trim() !== '' &&
            nameErrorMessage === '' &&
            prescriptionErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, prescription]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const handleAddMedication= async () => {
        const sinceDate = new Date(dateSince);
        sinceDate.setHours(timeSince.getHours()-3) //acomodo por el UCT
        sinceDate.setMinutes(timeSince.getMinutes())
        console.log("sinceDate completa:", sinceDate)
        dateUntil.setHours(dateUntil.getHours()-3) //UTC acomodo, esta bien?? o queremos q sea siempre hasta als 23:59 ?? todo
        console.log("dateUntil completa:", dateUntil)
        const medication : Medication = {
            id:'',
            name:name,
            prescription:prescription,
            sinceWhen:sinceDate,
            untilWhen:dateUntil,
            howOften:howOften,
            isForever:isForever,
        }
        const result = await addMedication(medication);
        if (result.success) {
            //navigation.navigate('AlertPublicity', { session, msg: 'text11', screen: 'Medications', appointment: null, du: null, doc: null, meds: null  });
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    }

    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage(t('warn1'));
        } else {
            setNameErrorMessage('');
        }
    };
    const validatePrescription = (value: string) => {
        if (value.trim() === '') {
            setPrescriptionErrorMessage(t('warn11'));
        } else {
            setPrescriptionErrorMessage('');
        }
    };

    const onSDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dateSince;
        setShowDatePickerSince(Platform.OS === 'ios');
        setDateSince(currentDate);
    };

    const onSTimeChange = (event: any, selectedTime: Date | undefined) => {
        const currentTime = selectedTime || timeSince;
        setShowTimePicker(Platform.OS === 'ios');
        setTimeSince(currentTime);
    };

    const getDateSince = () => {
        return dateSince ? dateSince.toLocaleDateString() : 'Seleccione una fecha';
    };

    const getTime = () => {
        return timeSince ? timeSince.toLocaleTimeString() : 'Seleccione una hora';
    };

    const onChange2 = (event: DateTimePickerEvent, selectedDate?: Date | undefined): void => {
        const currentDate = selectedDate || dateUntil;
        setShowDatePickerUntil(Platform.OS === 'ios');
        setDateUntil(currentDate);
    };

    const getDateUntil = () => {
        return dateUntil ? dateUntil.toLocaleDateString() : 'Seleccione una fecha';
    };
    const onChange3 = (value : boolean) => {
        setIsForever(!isForever);
    }
    const resetForm = () => {
        //poner todos los datos todo
        setName('');
        setPrescription('');
        setDateSince(new Date());
        setDateUntil(new Date());
        setHowOften(null);
        setNameErrorMessage('');
        setPrescriptionErrorMessage('');
    };

    return (
        <View style={styles.containerTotal}>
        <ScrollView>
        <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            onChangeText={(text) => {
                                setName(text);
                                validateName(text)
                            }}
                            value={name}
                            placeholder={t('name')}
                            autoCapitalize={'none'}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nameErrorMessage}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={(text) => {
                                setPrescription(text);
                                validatePrescription(text)
                            }}
                            value={prescription}
                            placeholder={t('prescription')}
                            autoCapitalize={'none'}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nameErrorMessage}
                        />
                    </View>
                    <View>
                        <RNText style={styles.buttons} >
                            <UnderlinedText>{t('text22')}</UnderlinedText>
                        </RNText>
                        <View style={styles.datePickerContainer}>
                            {Platform.OS === 'ios' ? (
                                <>
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={dateSince}
                                        mode="date"
                                        minimumDate={new Date()}
                                        display="default"
                                        style={{ backgroundColor: 'transparent' }}
                                        onChange={onSDateChange}
                                    />
                                    <DateTimePicker
                                        testID="timePicker"
                                        value={timeSince}
                                        mode="time"
                                        display="default"
                                        textColor='#cbe4c9'
                                        onChange={onSTimeChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <PaperButton
                                        mode="outlined"
                                        style={styles.pickerButton}
                                        textColor='#2E5829'
                                        labelStyle={{ textAlign: 'left', display: 'flex' }}
                                        onPress={() => setShowDatePickerSince(true)}
                                    >
                                        {getDateSince()}
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
                                    {showDatePickerSince && (
                                        <DateTimePicker
                                            testID="datePicker"
                                            value={dateSince}
                                            minimumDate={new Date()}
                                            mode="date"
                                            display="default"
                                            onChange={onSDateChange}
                                        />
                                    )}
                                    {showTimePicker && (
                                        <DateTimePicker
                                            testID="timePicker"
                                            value={timeSince}
                                            mode="time"
                                            display="default"
                                            onChange={onSTimeChange}
                                        />
                                    )}
                                </>
                            )}
                        </View>
                    </View>
                    <View style={{marginBottom: "5%", marginTop: "5%"}}>
                        <RNText style={styles.buttons} >
                            <UnderlinedText>  {t('text20')} </UnderlinedText>
                        </RNText>
                        <Picker
                            mode="dropdown"
                            selectedValue={howOften}
                            onValueChange={(value) => setHowOften(value)}>
                            {timesList.map((item, index) => (
                                <Picker.Item label={item.label} value={item.value}/>
                            ))}
                        </Picker>
                    </View>
                    <View>
                        <RNText style={styles.buttons}>
                            <UnderlinedText>{t('text21')}</UnderlinedText>
                        </RNText>
                        <View style={styles.datePickerContainer}>
                            {Platform.OS === 'ios' ? (
                                    <>
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={dateUntil}
                                        minimumDate={dateSince}
                                        mode="date"
                                        display="default"
                                        style={{ backgroundColor: 'transparent' }}
                                        onChange={onChange2}
                                    />
                                    </>
                            ) : (
                                <>
                                    <PaperButton
                                        mode="outlined"
                                        style={styles.pickerButton}
                                        textColor='#2E5829'
                                        labelStyle={{ textAlign: 'left', display: 'flex' }}
                                        onPress={() => setShowDatePickerUntil(true)}
                                    >
                                        {getDateUntil()}
                                    </PaperButton>
                                    {showDatePickerUntil && (
                                        <DateTimePicker
                                            testID="datePicker"
                                            value={dateUntil}
                                            minimumDate={dateSince}
                                            mode="date"
                                            display="default"
                                            onChange={onChange2}
                                        />
                                    )}
                                </>
                            )}
                        </View>
                        <View style={[cardStyle.infoRow, {marginTop: "5%"}]}>
                            <RNText style={styles.text}>
                               {t('text26')}
                            </RNText>
                            <Checkbox
                                style={{marginLeft: "3%", marginTop: "1.5%"}}
                                value={isForever}
                                onValueChange={onChange3}
                                color={'#2E5829'}
                            />
                        </View>
                    </View>
                    <View>
                        <View style={[styles.verticallySpaced, {marginTop : "5%"}]}>
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
                                    alignSelf: 'center',
                                }}
                                titleStyle={{ color: '#eef9ed' }}
                                onPress={() => {
                                    if(dateUntil === null){
                                        Alert.alert(t('warning'), t('warn14') ,
                                            [{ text: 'Cancel', onPress: () => {setIsButtonDisabled(true);  resetForm();}},
                                                { text: 'Ok', onPress: () => [handleAddMedication(), navigation.navigate('Medications', { session: session })]}])
                                    }
                                    else if(howOften === null){
                                        Alert.alert(t('warning') , t('warn13'),
                                            [{ text: 'Cancel', onPress: () => {setIsButtonDisabled(true);  resetForm();}},
                                                { text: 'Ok', onPress: () => [handleAddMedication(), navigation.navigate('Medications', { session: session })]}])
                                    }
                                    else{handleAddMedication()}
                                    }
                                }
                            />
                    </View>
                    </View>
                </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </ScrollView>
        </View>
    );
};

export default AddMedication;


const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 12,
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 17,
        marginTop: "1%",
        color: "#245e1e"
    },
    containerTotal:{
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    verticallySpaced: {
        alignSelf: 'stretch',
    },
    buttons: {
        alignItems: "flex-start"
    },
    datePicker: {
      alignSelf: 'center',
      marginTop: "5%",
    },
    titleB : {
        fontFamily: 'Roboto-Thin',
        alignSelf: 'center',
        color: '#12210f',
        fontSize: 18,
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
 });