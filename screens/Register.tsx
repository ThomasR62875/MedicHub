import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Alert,
    Image, Text as RNText, Platform
} from 'react-native';
import {signUp} from "../lib/supabase";
import {Input, Icon, Button} from "react-native-elements";
// @ts-ignore
import Logo from '../assets/icon_black.png'
import {useTranslation} from "react-i18next";
import ScrollableBg from "../components/ScrollableBg";
import {User} from '../lib/types';
import {Button as PaperButton, Dialog, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {getSexGenderName, sexGenderOptions, validateTextLength} from "../lib/ourlibrary";
import {styles} from "../assets/styles";


const Register: React.FC = ({navigation}: any) => {
    const textLength= 30;
    const dniLength= 8;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmed_password, setConfirmedPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dni, setDni] = useState('')
    const [date, setDate] = useState(new Date());
    const [sexGender,setSexGender]= useState('');
    const {t} = useTranslation();
    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState<string>('');
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const [mailErrorMessage, setMailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [birthDateErrorMessage, setBirthDateErrorMessage] = useState<string>('');
    const [genderErrorMessage, setGenderErrorMessage] = useState<string>('');
    const [showDatePickerUntil, setShowDatePickerUntil] = useState(false);


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
            passwordErrorMessage === '' &&
            birthDateErrorMessage === '' &&
            genderErrorMessage === ''
        ) {
        } else {
        }
    }, [firstName, lastName, dni, email, password, confirmed_password, date, sexGender, birthDateErrorMessage]);

    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage(t('warn1'));
        } else {
            let {result,msg}=validateTextLength(value,textLength);
            setNameErrorMessage(msg);
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn17'));
        } else {
            let {result,msg}= validateTextLength(value,textLength);
            setLastNameErrorMessage(msg);
        }
    };
    const validateDNI = (value: string) => {
        const containsLetterOrSymbol = /([a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-])/.test(value);
        let {result, msg} = validateTextLength(value, dniLength);
        if (value === '') {
            setDNIErrorMessage(t('warn18'));
        } else if (containsLetterOrSymbol) {
            setDNIErrorMessage(t('warn3'));
        } else if (!result) {
            setDNIErrorMessage(msg);
        } else {
            setDNIErrorMessage('');
        }
    };
    const validateEmail = (value: string) => {
        let {result,msg}= validateTextLength(value,textLength);
        if (value.trim() === '' || !value.includes("@") || !(value.includes(".edu") || value.includes(".com") || value.includes(".ar"))) {
            setMailErrorMessage(t('warn4'));
        } else if (!result) {
            setMailErrorMessage(msg);
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

    const validateBirthDate = (value : Date) => { // vamos a pedir q tenga minimo un día de vida
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const birthdate = new Date(value);
        birthdate.setHours(0, 0, 0, 0);

        if(birthdate >= yesterday){
            setBirthDateErrorMessage(t('warn19'));
        } else {
            setBirthDateErrorMessage('');
        }
    };


    const validateGender = (value: string) => {
        if (value.trim() === '') {
            setGenderErrorMessage(t('warn20'));
        } else {
            setGenderErrorMessage('');
        }
    };

    async function signUpWithEmail() {
        setLoading(true)
        const user: User = {id:"",first_name:firstName,last_name:lastName,dni:dni, email:email, sex: sexGender,
            birthdate: date}
        const {success} = await signUp(user,password);

        if (success) Alert.alert('¡Revise su bandeja de entrada para verificar el mail!',)
        setLoading(false)
    }

    const hideSexGenderDialog = () => setSexGenderDialog(false);
    const handleDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
            if (selectedDate) {
                const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
                setDate(localDate);
            }
    };

    const getBirthdate = () => {
        return date ? date.toLocaleDateString() : t('selectDate');
    };

    return (
        <View style={{flex: 1, backgroundColor: '#fff', marginBottom: 0}}>
            {/* Burbuja 1 */}
            <View
                style={[
                    styles.bubble,
                    {
                        width: 250,
                        height: 250,
                        borderRadius: 125,
                        left: 200,
                        top: -50,
                        backgroundColor: 'rgba(236,183,97,0.2)',
                    },
                ]}
            />
            {/* Burbuja 2 */}
            <View
                style={[
                    styles.bubble,
                    {
                        width: 400,
                        height: 400,
                        borderRadius: 200,
                        left: -60,
                        top: -200,
                        backgroundColor: 'rgba(236,183,97,0.2)',
                    },]}/>
            <Button
                loading={loading}
                buttonStyle={{
                    backgroundColor: 'transparent'
                }}
                containerStyle={{marginTop: '15%', alignItems: 'flex-start', marginLeft: '5%'}}
                icon={{name: 'arrow-left', type: 'material-community', color: '#000000', size: 25}}
                titleStyle={{color: '#000000'}}
                onPress={() => navigation.navigate('Login')}
            />
            <ScrollableBg style={{margin: '5%'}}>
                <View style={{marginBottom: 50, alignItems: 'center'}}>
                    <Image source={Logo} style={styles.logo}/>
                </View>
                <Text style={styles.Ptitle}>{t('text5')}</Text>
                <Input
                    label={t('name')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color} iconStyle={{fontSize: 20, paddingLeft: 10}} />}
                    onChangeText={(text) => {
                        setFirstName(text);
                        validateFirstName(text)
                    }}
                    value={firstName}
                    placeholder={t('name')}
                    inputContainerStyle={[{paddingLeft: 14}, styles.input]}
                    autoCapitalize={'none'}
                    placeholderTextColor={"#807d7d"}
                    inputStyle={{color: '#000', fontSize:14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={nameErrorMessage}
                />
                <Input
                    label={t('surname')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}  iconStyle={{fontSize: 20, paddingLeft: 10}} />}
                    onChangeText={(text) => {
                        setLastName(text);
                        validateLastName(text)
                    }}
                    value={lastName}
                    placeholder={t('surname')}
                    autoCapitalize={'none'}
                    placeholderTextColor={"#807d7d"}
                    inputStyle={{color: '#000', fontSize:14, marginLeft: 10}}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    errorStyle={{color: 'red'}}
                    errorMessage={lastNameErrorMessage}
                />
                <Input
                    label={t('id')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                    onChangeText={(text) => {
                        setDni(text);
                        validateDNI(text);
                    }}
                    value={dni}
                    placeholder={t('id')}
                    autoCapitalize={'none'}
                    inputContainerStyle={[{paddingLeft: 14}, styles.input]}
                    placeholderTextColor={"#807d7d"}
                    inputStyle={{color: '#000', fontSize:14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={DNIErrorMessage}
                />
                <PaperText style={styles.text4}>{t('sex')}</PaperText>
                <PaperButton mode="outlined" style={[styles.input, {padding: 5, marginHorizontal: '3%', marginBottom:'5%'}]} textColor='#000' labelStyle={{textAlign: 'left', display:'flex'}} contentStyle={{justifyContent: 'flex-start'}} onPress={()=> setSexGenderDialog(true)}>
                    {getSexGenderName(sexGender)}
                </PaperButton>


                <View style={{marginBottom: "5%", marginTop: "5%"}}>
                    <RNText style={styles.label2}>
                        {t('birthdate')}
                    </RNText>
                    <View style={styles.datePickerContainer}>
                        {Platform.OS === 'ios' ? (
                            <>
                                <DateTimePicker
                                    testID="datePicker"
                                    value={date || undefined}
                                    mode="date"
                                    display="default"
                                    style={{backgroundColor: 'transparent'}}
                                    onChange={(event, selectedDate) => {
                                        handleDateChange(event, selectedDate);
                                        validateBirthDate(date);
                                    }}
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
                                    {getBirthdate()}
                                </PaperButton>
                                {showDatePickerUntil && (
                                    <DateTimePicker
                                        testID="datePicker"
                                        value={date || undefined}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            handleDateChange(event, selectedDate);
                                            validateBirthDate(date);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </View>

                </View>


                <Input
                    label="Mail"
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="envelope" color={styles.colorIcon.color} iconStyle={{fontSize: 20, paddingLeft: 10}} />}
                    onChangeText={(text) => {
                        setEmail(text);
                        validateEmail(text)
                    }}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    placeholderTextColor={"#807d7d"}
                    inputStyle={{color: '#000', fontSize:14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={mailErrorMessage}
                />
                <Input
                    label={t('password')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color} iconStyle={{fontSize: 20, paddingLeft: 10}}/>}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholderTextColor={"#807d7d"}
                    inputStyle={{color: '#000', fontSize:14, marginLeft: 10}}
                    placeholder={t('password')}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    autoCapitalize={'none'}
                />
                <Input
                    label={t('confirmp')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color} iconStyle={{fontSize: 20, paddingLeft: 10}}/>}
                    onChangeText={(text1) => {
                        setConfirmedPassword(text1);
                        validatePassword(text1);
                    }}
                    value={confirmed_password}
                    secureTextEntry={true}
                    placeholder={t('password')}
                    autoCapitalize={'none'}
                    placeholderTextColor={"#807d7d"}
                    inputStyle={{color: '#000', fontSize:14, marginLeft: 10}}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    errorStyle={{color: 'red'}}
                    errorMessage={passwordErrorMessage}
                />
                <View style={{alignItems: 'center'}}>
                    <Button
                        title={t('register')}
                        loading={loading}
                        buttonStyle={{
                            backgroundColor: '#ecb761',
                            borderRadius: 30,
                            minHeight: 50,
                            minWidth: 150,
                        }}
                        containerStyle={{
                            width: 150,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            marginBottom: 100
                        }}
                        titleStyle={{color: '#fff'}}
                        onPress={() => signUpWithEmail()}
                    />
                </View>
                <View style={{padding: 100}}/>
            </ScrollableBg>
            <Dialog style={styles.dialog} visible={sexGenderDialog} onDismiss={hideSexGenderDialog}>
                <Text style={styles.dialogTitle}>{t("selSex")}</Text>
                <Picker
                    mode='dropdown'
                    selectedValue={sexGender}
                    onValueChange={(value: string) => {
                        setSexGender(value);
                        validateGender(value);
                    }}
                    placeholder='sex'
                    enabled={true}
                    itemStyle={styles.pickerStyle}
                >
                    {sexGenderOptions?.map((item) => (
                        <Picker.Item key={item.value} label={item.sex_gender_name} value={item.value} />
                    ))}
                </Picker>
            </Dialog>
        </View>
    );
};

export default Register;


