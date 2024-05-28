import React, { useState, useEffect } from 'react'
import {updateMedication} from '../lib/supabase'
import {View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Text as RNText, ScrollView} from 'react-native'
import {Button, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import UnderlinedText from "../components/UnderlinedText";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {cardStyle} from "../styles/global";
import Checkbox from "expo-checkbox";

type EditMedicationProps = NativeStackScreenProps<RootStackParamList, 'EditMedication'>;

const EditMedication:React.FC<EditMedicationProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState(route.params.medication.id)
    const [name, setName] = useState(route.params.medication.name)
    const [prescription, setPrescription] = useState(route.params.medication.prescription);
    const [dateSince, setDateSince] = useState<Date | null>(route.params.medication.dateSince);
    const [dateUntil, setDateUntil] = useState<Date | null>(route.params.medication.dateUntil);
    const [howOften, setHowOften] = useState<Date | null>(route.params.medication.howOften);
    const [isForever, setIsForever] = useState<boolean>(route.params.medication.isForever);
    const {t} = useTranslation();
    const [mode, setMode] = useState<'date' | 'time'>('date');
    const times = [
        '02:00:00',
        '04:00:00',
        '06:00:00',
        '08:00:00',
        '12:00:00',
        '48:00:00',
    ];
    const timesList = times.map((time) => ({
        label: time,
        value: time,
    }));
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [prescriptionErrorMessage, setPrescriptionErrorMessage] = useState('');

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

    const handleUpdateMedication = async () => {
        const session =  route.params.session;
        const medication  = {
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
            Alert.alert(
                'El Medicamento fue editado',
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Medication', { session: session }) }
                ]
            );
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
                        <View style={styles.datePicker}>
                            <DateTimePicker  testID="dateTimePicker"
                                             value={dateSince ? dateSince : new Date()}
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
    }
})