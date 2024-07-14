import React, {useEffect, useState} from 'react';
import {Alert, View,} from 'react-native';
import {addDependentUser} from "../lib/supabase";
import {Button, Icon, Input, Text} from "react-native-elements";
import {Image} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Button as PaperButton, Dialog, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import {getSexGenderName, sexGenderOptions} from "../lib/ourlibrary";
import {styles} from "../assets/styles";
// @ts-ignore
import Header from "../assets/header_violet.png";
import ScrollableBg from "../components/ScrollableBg";
import * as events from "node:events";

type AddDependentUserProps = NativeStackScreenProps<RootStackParamList, 'AddDependentUser'>

const AddDependentUser:React.FC<AddDependentUserProps> = ({navigation, route} : any) => {
    const session = route.params.session;
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [dni,setDni]  = useState('')
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [date, setDate] = useState(new Date());
    const [sexGender,setSexGender]= useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const {t} = useTranslation();
    const [birthDateErrorMessage, setBirthDateErrorMessage] = useState<string>('');
    const [genderErrorMessage, setGenderErrorMessage] = useState<string>('');


    useEffect(() => {
        if (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === '' &&
            birthDateErrorMessage === '' &&
            sexGender !== ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [firstName, lastName, dni, date, birthDateErrorMessage, sexGender, genderErrorMessage]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setFirstNameErrorMessage(t('warn1'));
        } else {
            setFirstNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn17'));
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        const containsLetterOrSymbol = /([a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-])/.test(value);
        if(value === ''){
            setDNIErrorMessage(t('warn18'));
        }
        if (containsLetterOrSymbol) {
            setDNIErrorMessage(t('warn3'));
        } else {
            setDNIErrorMessage('');
        }
    };

    const validateBirthDate = (value : Date | undefined) => { // vamos a pedir q tenga minimo un día de vida
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        let birthdate = new Date();
        if(value){
            birthdate = new Date(value);
        }
        birthdate.setHours(0, 0, 0, 0);

        if(birthdate >= yesterday){
            setBirthDateErrorMessage(t('warn19'));
        } else {
            setBirthDateErrorMessage('');
        }
    };

    const validateGender = (value: string) => {
        if (value == null || value.trim() === '') {
            setGenderErrorMessage(t('warn20'));
        } else {
            setGenderErrorMessage('');
        }

    };

    const handleAddDependentUser = async () => {
        const dep_user = {
            first_name: firstName, last_name :lastName, dni:dni, id: '', sex: sexGender,
            birthdate: date};

        const result = await addDependentUser(dep_user);
        if (result.success) {
            navigation.navigate('AlertPublicity', { session, msg: 'text9', screen: t('dusers'), appointment: null, du: null, doc: null, meds: null  });
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const hideSexGenderDialog = () => setSexGenderDialog(false);
    const handleDayPress = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        if (selectedDate) {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
            setDate(localDate);
        }
    };

    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(139,134,190,0.6)'}]}>
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: '10%',
                    marginVertical: '20%',
                    alignItems: 'flex-start',
                }}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'}
                          style={styles.back_arrow}
                          onPress={() => navigation.navigate(t('dusers'), {session: session})}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {
                        backgroundColor: 'rgba(139,134,190,0.6)',
                        marginHorizontal: '35%',
                        alignSelf: 'center'
                    }]} name={'account'} type={'material-community'}/>
                </View>
            </View>
            <ScrollableBg style={{padding: '10%'}}>

                <Input
                    label={t('name')}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}
                                    iconStyle={{fontSize: 20, paddingLeft: 10}}/>}
                    value={firstName}
                    onChangeText={(text) => {
                        setFirstName(text);
                        validateFirstName(text)
                    }}
                    autoCapitalize={'none'}
                    errorStyle={{ color: 'red' }}
                    errorMessage={firstNameErrorMessage}
                    labelStyle={styles.label2}
                    placeholder={t('name')}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                />

                <Input
                    label={t('surname')}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}
                                    iconStyle={{fontSize: 20, paddingLeft: 10}}/>}
                    value={lastName}
                    onChangeText={(text) => {
                        setLastName(text);
                        validateLastName(text)
                    }}
                    autoCapitalize={'none'}
                    errorStyle={{ color: 'red' }}
                    errorMessage={lastNameErrorMessage}
                    labelStyle={styles.label2}
                    placeholder={t('surname')}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                />

                <Input
                    label={t('id')}
                    leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                    value={dni}
                    onChangeText={(text) => {
                        setDni(text);
                        validateDNI(text);
                    }}
                    autoCapitalize={'none'}
                    errorStyle={{ color: 'red' }}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    placeholder={t('id')}
                    errorMessage={DNIErrorMessage}
                />

                <PaperText style={styles.label2}>{t('sex')}</PaperText>
                <PaperButton mode="outlined" style={[styles.input, {padding: 5, marginHorizontal: '3%', marginBottom:'5%'}]} textColor='#000' labelStyle={{textAlign: 'left', display:'flex'}} contentStyle={{justifyContent: 'flex-start'}} onPress={()=> setSexGenderDialog(true)}>
                    {getSexGenderName(sexGender)}
                </PaperButton>
                <PaperText style={styles.label2}>{t('birthdate')}</PaperText>
                <View style={styles.datePicker}>
                    <DateTimePicker testID="dateTimePicker"
                                    value={date || undefined}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        handleDayPress(event, selectedDate);
                                        validateBirthDate(selectedDate);
                                    }}/>
                </View>
                <Button
                    title={t('addnewu')}
                    buttonStyle={{
                        backgroundColor: '#8b86be',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50,
                    }}
                    containerStyle={{
                        width: 210,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        marginTop: 40,
                        marginBottom: 100
                    }}
                    titleStyle={{color: '#eef9ed'}}
                    disabled={isButtonDisabled}
                    onPress={handleAddDependentUser}
                />
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
}

export default AddDependentUser;
