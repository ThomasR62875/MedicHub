import React, { useState, useEffect } from 'react'
import {updateMedication} from '../lib/supabase'
import {
    View,
    StyleSheet,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    Text as RNText,
    ScrollView,
    Platform
} from 'react-native'
import {Button, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import Checkbox from "expo-checkbox";
import {cardStyle} from "../styles/global";
import UnderlinedText from "../components/UnderlinedText";
import { Picker } from '@react-native-picker/picker';
import {Button as PaperButton} from "react-native-paper";

type EditMedicationProps = NativeStackScreenProps<RootStackParamList, 'EditMedication'>;

const EditMedication:React.FC<EditMedicationProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState(route.params.medication.id)
    const [name, setName] = useState(route.params.medication.name)
    const [prescription, setPrescription] = useState(route.params.medication.prescription);
    const [dateSince, setDateSince] = useState<Date>(route.params.medication.sinceWhen ? new Date(route.params.medication.sinceWhen) : new Date());
    const [timeSince, setTimeSince] = useState<Date>(route.params.medication.sinceWhen ? new Date(route.params.medication.sinceWhen): new Date());
    const [dateUntil, setDateUntil] = useState<Date>(route.params.medication.untilWhen ? new Date(route.params.medication.untilWhen) : new Date());
    const [howOften, setHowOften] = useState<Date | null>(route.params.medication.howOften);
    const [isForever, setIsForever] = useState<boolean>(route.params.medication.isForever);
    const [showDatePickerSince, setShowDatePickerSince] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePickerUntil, setShowDatePickerUntil] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [prescriptionErrorMessage, setPrescriptionErrorMessage] = useState('');
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

    }, [name, prescription, dateSince, dateUntil, howOften, isForever]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const handleUpdateMedication = async () => {
        const session = route.params.session;
        const sinceDate = new Date(dateSince);
        sinceDate.setHours(timeSince.getHours() - 3) //acomodo por el UCT
        sinceDate.setMinutes(timeSince.getMinutes())
        console.log("sinceDate completa:", sinceDate)
        dateUntil.setHours(dateUntil.getHours() - 3) //UTC acomodo, esta bien?? o queremos q sea siempre hasta als 23:59 ?? todo
        console.log("dateUntil completa:", dateUntil)

        const medication   = {
            id: id,
            name: name,
            prescription: prescription,
            sinceWhen:dateSince,
            untilWhen:dateUntil,
            howOften:howOften,
            isForever:isForever,
        }
        const result = await updateMedication(medication);
        if (result.success) {
            //navigation.navigate('AlertPublicity', { session, msg: 'editMed', screen: 'SingleMedication', meds: medication});  //tira error a veces xd
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };


    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage('Debe ingresar el nombre del medicamento.');
        } else {
            setNameErrorMessage('');
        }
    };
    const validatePrescription = (value: string) => {
        if (value.trim() === '') {
            setPrescriptionErrorMessage('Debe ingresar la prescripción.');
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

    return(
        <View style={styles.container} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView>
                <View style={styles.window}>
                    <Input
                        label={t('name')}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            validateName(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={nameErrorMessage}/>
                    <Input
                        label={t('prescription')}
                        value={prescription}
                        onChangeText={(text) => {
                            setPrescription(text);
                            validatePrescription(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={prescriptionErrorMessage}
                    />
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
                                onValueChange={setIsForever}
                                color={'#2E5829'}
                            />
                        </View>
                    </View>
                    <Button
                        title={t('savec')}
                        buttonStyle={{
                            backgroundColor: '#2E5829',
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
                        titleStyle={{ color: '#EEF9ED' }}
                        disabled={isButtonDisabled}
                        onPress={handleUpdateMedication}
                    />
                </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default EditMedication

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        alignContent: 'center'
    },
    window: {
        alignItems: 'center',
        marginTop: '20%',
        marginLeft: '5%',
        marginRight: '5%'
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 17,
        marginTop: "1%",
        color: "#245e1e"
    },
    buttons: {
        alignItems: "flex-start"
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: "5%",
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
})