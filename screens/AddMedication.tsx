import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    Text as RNText, ScrollView
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

type AddMedicationProps = NativeStackScreenProps<RootStackParamList, 'AddMedication'>

const AddMedication: React.FC<AddMedicationProps> = ({navigation, route}) => {
    const {session} = route.params;
    const [name, setName] = useState('')
    const [prescription, setPrescription] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [prescriptionErrorMessage, setPrescriptionErrorMessage] = useState('');
    const [dateSince, setDateSince] = useState(new Date());
    const [dateUntil, setDateUntil] = useState<Date | null>(null);
    const [howOften, setHowOften] = useState<Date | null>(null);
    const [isForever, setIsForever] = useState<boolean>(false);
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
        const medication : Medication = {
            id:'',
            name:name,
            prescription:prescription,
            sinceWhen:dateSince,
            untilWhen:dateUntil,
            howOften:howOften,
            isForever:isForever,
        }

        const result = await addMedication(medication);
        if (result.success) {
            navigation.navigate('AlertPublicity', { session, msg: 'text11', screen: 'Medications' });
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

    const [mode, setMode] = useState<'date' | 'time'>('date');

    const onChange1 = (event: DateTimePickerEvent, selectedDate1?: Date | undefined): void => {
        let currentDate;
        if(selectedDate1){
            currentDate = new Date(selectedDate1);
            currentDate.setHours(currentDate.getHours()); //acomodor por la dif horaria todo
        }
        else{
            currentDate=dateSince;
        }
        console.log(currentDate);
        setDateSince(currentDate);
    };

    const onChange2 = (event: DateTimePickerEvent, selectedDate2?: Date | undefined): void => {
        const currentDate = selectedDate2 || dateUntil;
        setDateUntil(currentDate);
    };

    const onChange3 = (value : boolean) => {
        setIsForever(!isForever);
    }
    const resetForm = () => {
        setName('');
        setPrescription('');
        setDateSince(new Date());
        setHowOften(null);
        setDateUntil(null);
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
                        <View style={styles.datePicker}>
                            <DateTimePicker  testID="dateTimePicker"
                                             value={dateSince}
                                             mode="datetime"
                                             onChange={onChange1}
                            />
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
                        <View style={styles.datePicker}>
                            <DateTimePicker  testID="dateTimePicker"
                                             value={dateUntil ? dateUntil : new Date()}
                                             mode={mode}
                                             onChange={onChange2}
                            />
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
 });