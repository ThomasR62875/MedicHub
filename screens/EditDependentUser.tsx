import React, { useState, useEffect } from 'react'
import {supabase, updateDependentUser} from '../lib/supabase'
import {View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Platform} from 'react-native'
import {Button, Icon, Input, Text} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Text as PaperText} from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {SexGenderOption} from "../lib/types";
import {getDate} from "date-fns";
import {Calendar, DateData} from "react-native-calendars";
import ScrollableBg from '../components/ScrollableBg';

type EditDependentUserProps = NativeStackScreenProps<RootStackParamList, 'EditDependentUser'>;

const EditDependentUser:React.FC<EditDependentUserProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState('');
    const [first_name,setFirstName] = useState('');
    const [last_name,setLastName] = useState('');
    const [dni,setDni]  = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [sexGender,setSexGender]= useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const {t} = useTranslation();

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [dniErrorMessage, setDniErrorMessage] = useState('')

    const sexGenderOptions: SexGenderOption[] = [
        { sex_gender_name: t('male'), value: 'male' },
        { sex_gender_name: t('female'), value: 'female' },
        { sex_gender_name: t('non-binary'), value: 'non-binary' },
        { sex_gender_name: t('other'), value: 'other' },
    ];

    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const stringDay = day.toString();
        return `${year}-${month}-${stringDay}`;
    };
    const [selectedDate, setSelectedDate] = useState(route.params.du.birthdate.dateString);
    const handleDayPress = (date: DateData) => {
        // @ts-ignore
        setSelectedDate(date.dateString)
        setDate(new Date(date.dateString));
        console.log('Fecha seleccionada:', date);
    };

    useEffect(() => {
        if (
            first_name.trim() !== '' &&
            last_name.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [first_name, last_name, dni]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);


    useEffect(() => {
        if (session) getDU()
    }, [session])


    const handleUpdateDependentUser = async () => {

        const session =  route.params.session;
        const du  = {id: id , first_name: first_name, last_name: last_name, dni: dni.toString(), birthdate: date, sex: sexGender}
        const result = await updateDependentUser(du);
        if (result.success) {
            Alert.alert(
                t('editDepUser'),
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Usuarios', { session: session }) }
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    async function getDU() {
        setId(route.params.du.id)
        setFirstName(route.params.du.first_name);
        setLastName(route.params.du.last_name);
        setDni(route.params.du.dni);
        setSelectedDate(route.params.du.birthdate);
        setDate(route.params.du.birthdate);
        setSexGender(route.params.du.sex);

    }

    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setFirstNameErrorMessage(t('warn17'));
        } else {
            setFirstNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn18'));
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        if (value.trim() === '') {
            setDniErrorMessage(t('warn19'));
        } else {
            setDniErrorMessage('');
        }
    };

    const onDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };


    const hideSexGenderDialog = () => setSexGenderDialog(false);

    const getSexGenderName = (value: string) => {
        if(value == null)
            return ''
        const option = sexGenderOptions.find(option => option.value === value);
        return option ? option.sex_gender_name : '';
    };

    const markedDatesString = {
        [selectedDate]: {
            selected: true,
            selectedColor: '#073A29',
        },
    };

    const customTheme = {
        arrowColor: '#00A36C',
        todayTextColor: '#00A36C',
    }

    return(
        <ScrollableBg>
            <View style={styles.container} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <View style={styles.window}>
                        <Input
                            label={t('name')}
                            value={first_name}
                            onChangeText={(text) => {
                                setFirstName(text);
                                validateFirstName(text)
                            }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={firstNameErrorMessage}
                        />
                        <Input
                            label={t('surname')}
                            value={last_name}
                            onChangeText={(text) => {
                                setLastName(text);
                                validateLastName(text)
                            }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={firstNameErrorMessage}
                        />
                        <Input
                            label={t('id')}
                            value={dni.toString()}
                            onChangeText={(text) => {
                                setDni(text)
                                validateDNI(text)
                            }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={dniErrorMessage}
                        />
                        <PaperText style={styles.text}>{t('sex')}</PaperText>
                        <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setSexGenderDialog(true)}>
                            {getSexGenderName(sexGender)}
                        </PaperButton>
                        <PaperText style={styles.text}>{t('birthdate')}</PaperText>
                        <View style={styles.calendarContainer}>
                            <Calendar style={{borderRadius: 10}}
                                      markingType={'custom'}
                                      onDayPress={handleDayPress}
                                      markedDates={markedDatesString}
                                      theme={customTheme}
                            />
                        </View>
                        <Dialog style={styles.dialog} visible={sexGenderDialog} onDismiss={hideSexGenderDialog}>
                            <Text style={styles.dialogTitle}>{t("selSex")}</Text>
                            <Picker
                                mode='dropdown'
                                selectedValue={sexGender}
                                onValueChange={(value: string) => setSexGender(value)}
                                placeholder='sex'
                                enabled={true}
                                itemStyle={styles.pickerStyle}
                            >
                                {sexGenderOptions?.map((item) => (
                                    <Picker.Item key={item.value} label={item.sex_gender_name} value={item.value} />
                                ))}
                            </Picker>
                        </Dialog>
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
                            onPress={handleUpdateDependentUser}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </ScrollableBg>
    )
}

export default EditDependentUser

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
    },
    pickerStyle: {
        marginBottom: 20,
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 14,
        marginTop: "5%",
        marginLeft: '4%',
        marginBottom: '2%',
        color: "#2E5829FF",
        width: "60%"
    },
    calendarContainer: {
        margin: '5%',
        backgroundColor: "#E9F4E9FF"
    },
})