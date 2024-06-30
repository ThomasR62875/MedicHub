import React, {useEffect, useState} from 'react';
import {Alert, Platform, StyleSheet, View,} from 'react-native';
import {addDependentUser} from "../lib/supabase";
import {Button, Icon, Input, Text} from "react-native-elements";
import {Image} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {SexGenderOption} from "../lib/types";
import {Calendar, DateData} from "react-native-calendars";
import ScrollableBg from "../components/ScrollableBg";

type AddDependentUserProps = NativeStackScreenProps<RootStackParamList, 'AddDependentUser'>

const AddDependentUser:React.FC<AddDependentUserProps> = ({navigation, route} : any) => {
    const session = route.params.session;
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [dni,setDni]  = useState('')
    const [loading,setLoading]= useState(false)
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [date, setDate] = useState(new Date());
    const [sexGender,setSexGender]= useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const {t} = useTranslation();

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

    const handleDayPress = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            const birthdateWithTime = new Date(selectedDate);
            birthdateWithTime.setUTCHours(1, 0, 0, 0);
            setDate(birthdateWithTime);
        }
    };


    useEffect(() => {
        if (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [firstName, lastName, dni]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

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
        const containsLetterOrSymbol = /([a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-])/.test(value);
        if (containsLetterOrSymbol) {
            setDNIErrorMessage(t('warn3'));
        } else {
            setDNIErrorMessage('');
        }
    };

    const handleAddDependentUser = async () => {
        console.log(sexGender)
        const dep_user = {
            first_name: firstName, last_name :lastName, dni:dni, id: '', sex: sexGender,
            birthdate: date};

        const result = await addDependentUser(dep_user);
        if (result.success) {
            Alert.alert(t('text9'), '',
                [{ text: 'Ok', onPress: () => navigation.navigate('Usuarios', { session: session }) }]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const hideSexGenderDialog = () => setSexGenderDialog(false);

    const getSexGenderName = (value: string) => {
        const option = sexGenderOptions.find(option => option.value === value);
        return option ? option.sex_gender_name : '';
    };

    return (
        <ScrollableBg>
            <View style={styles.container}>
                <Text style={styles.screenTitle}>{t('newu')}</Text>
                    <Input
                        label={t('name')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type="material-icons" name="person" color={styles.colorLable.color}/>}
                        onChangeText={(text) => {
                            setFirstName(text);
                            validateFirstName(text)
                        }}
                        value={firstName}
                        placeholder={t('name')}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                        errorStyle={{ color: 'red' }}
                        errorMessage={firstNameErrorMessage}
                    />
                    <Input
                        label={t('surname')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type="material-icons" name="person" color={styles.colorLable.color}/>}
                        onChangeText={(text) => {
                            setLastName(text);
                            validateLastName(text)
                        }}
                        value={lastName}
                        placeholder={t('surname')}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                        errorStyle={{ color: 'red' }}
                        errorMessage={firstNameErrorMessage}
                    />
                    <Input
                        label={t('id')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                        onChangeText={(text) => {
                            setDni(text);
                            validateDNI(text);
                        }}
                        value={dni}
                        placeholder={t('id')}
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={DNIErrorMessage}
                    />
                    <PaperText style={styles.text}>{t('sex')}</PaperText>
                    <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setSexGenderDialog(true)}>
                        {getSexGenderName(sexGender)}
                    </PaperButton>
                    <PaperText style={styles.text}>{t('birthdate')}</PaperText>
                    <View style={styles.datePicker}>
                        <DateTimePicker  testID="dateTimePicker"
                                         value={date ? date : new Date()}
                                         mode="date"
                                         display="default"
                                         onChange={(event, selectedDate) => handleDayPress(event, selectedDate)}
                        />
                    </View>
                    <Portal>
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
                            <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                                <PaperButton textColor="#2E5829FF"
                                             onPress={hideSexGenderDialog}>
                                    {t("close")}
                                </PaperButton>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
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

                        onPress={handleAddDependentUser}
                    />
                </View>
        </ScrollableBg>
      );
}

export default AddDependentUser;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#e9f4e9', height: "100%"
    },
    icon: {
        width: 24,
        height: 24,
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: "5%",
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        marginBottom: "15%",
        color: "#2E5829FF",
    },
    window: {
        alignItems: 'center',
        marginTop: "20%",
        width: "90%",
    },
    colorLable: {
        color: '#2E5829FF',
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
});
