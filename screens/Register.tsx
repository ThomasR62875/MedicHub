import React, {useEffect, useState} from 'react';
import {View, ScrollView, Text, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Image} from 'react-native';
import {signUp, supabase} from "../lib/supabase";
import {Input, Icon, Button} from "react-native-elements";
// @ts-ignore
import Logo from '../assets/icon.png'
import {useTranslation} from "react-i18next";
import ScrollableBg from "../components/ScrollableBg";
import {SexGenderOption, User} from '../lib/types';
import {Button as PaperButton, Dialog, Text as PaperText} from "react-native-paper";
import {Calendar, DateData} from "react-native-calendars";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";


const Register: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmed_password, setConfirmedPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dni, setDni] = useState('')

    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState<string>('');
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [date, setDate] = useState(new Date());
    const [sexGender,setSexGender]= useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const [mailErrorMessage, setMailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const {t} = useTranslation();


    const sexGenderOptions: SexGenderOption[] = [
        { sex_gender_name: t('male'), value: 'male' },
        { sex_gender_name: t('female'), value: 'female' },
        { sex_gender_name: t('non-binary'), value: 'non-binary' },
        { sex_gender_name: t('other'), value: 'other' },
    ];

    useEffect(() => {
        if (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            dni.trim() !== '' &&
            email.trim() !== '' &&
            password.trim() !== '' &&
            confirmed_password.trim() !== '' &&
            nameErrorMessage === '' &&
            lastNameErrorMessage === '' &&
            DNIErrorMessage === '' &&
            mailErrorMessage === '' &&
            passwordErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [firstName, lastName, dni, email, password, confirmed_password]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage(t('warn1'));
        } else {
            setNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn2'));
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        const containsLetterOrSymbol = /[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-]/.test(value);
        if (containsLetterOrSymbol) {
            setDNIErrorMessage(t('warn3'));
        } else {
            setDNIErrorMessage('');
        }
    };
    const validateEmail = (value: string) => {
        if (value.trim() === '' || !value.includes("@") || !(value.includes(".edu") || value.includes(".com") || value.includes(".ar"))) {
            setMailErrorMessage(t('warn4'));
        } else {
            setMailErrorMessage('');
        }
    };
    const validatePassword = (value: string) => {
        if (password !== value) {
            setPasswordErrorMessage(t('warn5'));
        } else {
            setPasswordErrorMessage('');
        }
    };

    async function signUpWithEmail() {
        setLoading(true)
        const user: User = {id:"",first_name:firstName,last_name:lastName,dni:dni, email:email, sex: sexGender,
            birthdate: date}
        const {success,message} = await signUp(user,password);

        if (success) Alert.alert('¡Revise su bandeja de entrada para verificar el mail!',)
        setLoading(false)
    }

    const hideSexGenderDialog = () => setSexGenderDialog(false);

    const getSexGenderName = (value: string) => {
        const option = sexGenderOptions.find(option => option.value === value);
        return option ? option.sex_gender_name : '';
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    return (
        <ScrollableBg>
                <View style={{marginBottom: 50, alignItems: 'center'}}>
                    <Image source={Logo} style={styles.logo} />
                </View>
                <Text style={styles.Ptitle}>{t('text5')}</Text>
                    <Input
                        label={t('name')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => {
                            setFirstName(text);
                            validateName(text)
                        }}
                        value={firstName}
                        placeholder={t('name')}
                        placeholderTextColor={"#407738"}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={nameErrorMessage}
                    />
                    <Input
                        label={t('surname')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => {
                            setLastName(text);
                            validateLastName(text)
                        }}
                        value={lastName}
                        placeholder={t('surname')}
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={lastNameErrorMessage}
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
                <DateTimePicker testID="dateTimePicker"
                                value={date || undefined}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
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
                    <Input
                        label="Mail"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="envelope" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => {setEmail(text); validateEmail(text)}}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={mailErrorMessage}
                    />
                    <Input
                        label={t('password')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder={t('password')}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                    />
                    <Input
                        label={t('confirmp')}
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type="font-awesome"  name="lock" color={styles.colorIcon.color}/>}
                        onChangeText={(text1) => {
                            setConfirmedPassword(text1);
                            validatePassword(text1);
                        }}
                        value={confirmed_password}
                        secureTextEntry={true}
                        placeholder={t('password')}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                        errorStyle={{ color: 'red' }}
                        errorMessage={passwordErrorMessage}
                    />
                    <View style={{alignItems: 'center'}}>
                        <Button
                            title={t('register')}
                            disabled={isButtonDisabled}
                            loading={loading}
                            buttonStyle={{
                                backgroundColor: '#2E5829',
                                borderWidth: 2,
                                borderColor: 'white',
                                borderRadius: 30,
                                minHeight: 50,
                                minWidth: 150,
                            }}
                            containerStyle={{
                                width: 150,
                                marginHorizontal: 50,
                                marginVertical: 10,
                                marginTop: 40,
                                marginBottom:100
                            }}
                            titleStyle={{ color: '#eef9ed' }}
                            onPress={() => signUpWithEmail()}
                        />
                    </View>
        </ScrollableBg>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20
    },
    buttonSignInContainer: {
        width: '50%',
        justifyContent: 'center',
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: "5%",
    },
    buttonSignIn: {
        backgroundColor: '#B5DCCA',
        borderRadius: 10,
        justifyContent: 'center',
    },
    colorIcon: {
        color: '#2E5829FF'
    },
    colorLable: {
        color: '#2E5829FF',
    },
    icon: {
        width: 24,
        height: 24,
    }, registerW: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    Ptitle: {
        color: '#2E5829FF',
        textAlign: 'center',
        marginBottom: 80,
        marginTop: 0,
        fontSize: 20,
        fontWeight: 'bold'
    },
    logo: {
        height: 50,
        width: 50,
        marginBottom: 0
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

export default Register;


