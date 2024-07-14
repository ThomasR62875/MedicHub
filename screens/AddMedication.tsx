import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    Text as RNText, Platform
} from 'react-native';
import {addMedication} from "../lib/supabase";
import {Button, Icon, Input} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Medication} from '../lib/types';
import {useTranslation} from "react-i18next";
import {Picker} from '@react-native-picker/picker'
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import {cardStyle} from "../styles/global"
import {Button as PaperButton} from "react-native-paper";
import {styles} from "../assets/styles";
import ScrollableBg from "../components/ScrollableBg";

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
            prescriptionErrorMessage === '' &&
            ((dateUntil < dateSince && isForever) || (dateUntil > dateSince))
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, prescription, dateUntil, isForever, dateSince]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const handleAddMedication= async () => {
        const sinceDate = new Date(dateSince);
        sinceDate.setHours(timeSince.getHours())
        sinceDate.setMinutes(timeSince.getMinutes())
        //osea el horario nunca se toca en dateUntil, pero nso sirve tenerlo bien para mandar las notis
        dateUntil.setHours(dateUntil.getHours() - 3) //UTC acomodo, esta bien?? o queremos q sea siempre hasta las 23:59 ?? todo

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
            navigation.navigate('AlertPublicity', { session, msg: 'text11', screen: 'Medications', appointment: null, du: null, doc: null, meds: null  });
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
        return dateSince ? dateSince.toLocaleDateString() : t('selectDate');
    };

    const getTime = () => {
        return timeSince ? timeSince.toLocaleTimeString() : t('selectTime');
    };

    const onChange2 = (event: DateTimePickerEvent, selectedDate?: Date | undefined): void => {
        if (selectedDate) {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
            setShowDatePickerUntil(Platform.OS === 'ios');
            setDateUntil(localDate);
        }
    };

    const getDateUntil = () => {
        return dateUntil ? dateUntil.toLocaleDateString() : t('selectDate');
    };

    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(222,176,189,0.6)'}]}>
                <View style={{
                    flexDirection: 'row',
                    marginVertical: '20%',
                    marginHorizontal: '10%',
                    alignItems: 'flex-start',
                }}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'}
                          style={styles.back_arrow}
                          onPress={() => navigation.navigate('Medications', {session: session})}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {
                        backgroundColor: 'rgba(222,176,189,0.6)',
                        alignSelf: 'center',
                        marginHorizontal: '35%'
                    }]} name={'pill'} type={'material-community'}/>
                </View>
            </View>

            <ScrollableBg style={{padding: '10%'}}>
                <Input
                    label={t('name')}
                    placeholder={t('name')}
                    value={name}
                    onChangeText={(text) => {
                        setName(text);
                        validateName(text)
                    }}
                    errorStyle={{color: 'red'}}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    errorMessage={nameErrorMessage}/>
                <Input
                    label={t('prescription')}
                    placeholder={t('prescription')}
                    value={prescription}
                    onChangeText={(text) => {
                        setPrescription(text);
                        validatePrescription(text)
                    }}
                    errorStyle={{color: 'red'}}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    errorMessage={prescriptionErrorMessage}
                />
                <RNText style={[styles.label2, {marginLeft: '3%'}]}>
                    {t('text22')}
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
                                style={{backgroundColor: 'transparent'}}
                                onChange={onSDateChange}
                            />
                            <DateTimePicker
                                testID="timePicker"
                                value={timeSince}
                                mode="time"
                                display="default"
                                textColor='#cbe4c9'
                                onChange={onSTimeChange}
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
                                         onPress={() => setShowDatePickerSince(true)}>
                                {getDateSince()}
                            </PaperButton>
                            <PaperButton mode="outlined" style={[styles.input, {
                                padding: 5,
                                marginHorizontal: '3.5%',
                                marginBottom: '5%'
                            }]} textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                                         contentStyle={{justifyContent: 'flex-start'}}
                                         onPress={() => setShowTimePicker(true)}>
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

                <View>
                    <RNText style={[styles.label2, {marginLeft: '3%'}]}>
                        {t('text21')}
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
                                    style={{backgroundColor: 'transparent'}}
                                    onChange={onChange2}
                                />
                            </>
                        ) : (
                            <>
                                <PaperButton mode="outlined" style={[styles.input, {
                                    padding: 5,
                                    marginHorizontal: '3.5%',
                                    marginBottom: '5%'
                                }]} textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                                             contentStyle={{justifyContent: 'flex-start'}}
                                             onPress={() => setShowDatePickerUntil(true)}>
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
                    <View style={{marginBottom: "5%", marginTop: "5%"}}>
                        <RNText style={[styles.label2,{marginLeft: '3%'}]}>
                            {t('selectTime')}
                        </RNText>
                        <Picker
                            mode="dropdown"
                            selectedValue={howOften}
                            onValueChange={(value) => setHowOften(value)}>
                            {timesList.map((item, index) => (
                                <Picker.Item label={item.label} value={item.value} key={index}/>
                            ))}
                        </Picker>
                    </View>
                    <View style={[cardStyle.infoRow, {marginTop: "5%", justifyContent: 'center'}]}>
                        <RNText style={styles.label2}>
                            {t('text26')}
                        </RNText>
                        <Checkbox
                            style={{marginLeft: "3%"}}
                            value={isForever}
                            onValueChange={setIsForever}
                            color={'#000'}
                        />
                    </View>
                </View>
                <Button
                    title={t('addnewmed')}
                    buttonStyle={{
                        backgroundColor: '#deb0bd',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50
                    }}
                    containerStyle={{
                        width: 270,
                        marginHorizontal: 20,
                        marginVertical: 10,
                        marginTop: 40,
                        alignContent: 'center'
                    }}
                    titleStyle={{color: '#fff'}}
                    disabled={isButtonDisabled}
                    onPress={handleAddMedication}
                    /*onPress={() => {
                        if(dateUntil === null){
                            Alert.alert(t('warning'), t('warn14') ,
                                [{ text: 'Cancel', onPress: () => {setIsButtonDisabled(true);}},
                                    { text: 'Ok', onPress: () => [handleAddMedication(), navigation.navigate('Medications', { session: session })]}])
                        }
                        else if(howOften === null){
                            Alert.alert(t('warning') , t('warn13'),
                                [{ text: 'Cancel', onPress: () => {setIsButtonDisabled(true);}},
                                    { text: 'Ok', onPress: () => [handleAddMedication(), navigation.navigate('Medications', { session: session })]}])
                        }
                        else{handleAddMedication()}
                    }}*/
                />
            </ScrollableBg>


        </View>
    );
};

export default AddMedication;