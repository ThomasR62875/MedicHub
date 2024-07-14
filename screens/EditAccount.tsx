import React, {useState, useEffect} from 'react'
import {getUserSession, updateDependentUser} from '../lib/supabase'
import {View, Alert} from 'react-native'
import {Button, Icon, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import ScrollableBg from '../components/ScrollableBg';
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {getSexGenderName, sexGenderOptions} from "../lib/ourlibrary";
import {styles} from "../assets/styles";


type EditAccountProps = NativeStackScreenProps<RootStackParamList, 'EditAccount'>;


const EditAccount: React.FC<EditAccountProps> = ({navigation, route}: any) => {
    const {session} = route.params;
    const [id, setId] = useState('');
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [dni, setDni] = useState('');
    const [date, setDate] = useState(new Date());
    const [sexGender, setSexGender] = useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const {t} = useTranslation();
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [dniErrorMessage, setDniErrorMessage] = useState('')
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [birthDateErrorMessage, setBirthDateErrorMessage] = useState<string>('');
    const [genderErrorMessage, setGenderErrorMessage] = useState<string>('');


    useEffect(() => {
        if (
            first_name.trim() !== '' &&
            last_name.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === '' &&
            birthDateErrorMessage === '' &&
            genderErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [first_name, last_name, dni, sexGender, date, birthDateErrorMessage]);


    useEffect(() => {
        if (session) {
            const fetchUser = async () => {
                const userData = await getUserSession(session.user.id);
                setId(userData.id)
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setDni(userData.dni);

                const birthdateWithTime = new Date(userData.birthdate);
                setDate(birthdateWithTime);
                setSexGender(userData.sex);
            };
            fetchUser();
        }
    }, [session])


    const handleUpdateUser = async () => {
        const us = {id: id, first_name: first_name, last_name: last_name, dni: dni, birthdate: date, sex: sexGender}
        const result = await updateDependentUser(us);
        if (result.success) {
            navigation.navigate('AlertPublicity', {
                session,
                msg: 'editUser',
                screen: 'Perfil',
                appointment: null,
                du: null,
                doc: null,
                meds: null
            });
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };


    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setFirstNameErrorMessage(t('warn16'));
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
        if (value.trim() === '') {
            setDniErrorMessage(t('warn18'));
        } else {
            setDniErrorMessage('');
        }
    };

    const validateBirthDate = (value: Date) => { // vamos a pedir q tenga minimo un día de vida
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const birthdate = new Date(value);
        birthdate.setHours(0, 0, 0, 0);

        if (birthdate >= yesterday) {
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
    const hideSexGenderDialog = () => setSexGenderDialog(false);
    const handleDayPress = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            let birthdateWithTime = new Date(selectedDate);
            birthdateWithTime.setHours(0, 0, 1, 0);
            setDate(birthdateWithTime);
        }
    };

    return (
        <View style={{flex: 1, backgroundColor: '#fff', marginBottom: 0}}>
            <View
                style={[{
                    width: 500,
                    height: 500,
                    borderRadius: 250,
                    left: 50,
                    top: -250,
                    backgroundColor: 'rgba(203,214,144,0.2)',
                    position: 'absolute',
                },]}/>
            <View
                style={[{
                    width: 400,
                    height: 400,
                    borderRadius: 200,
                    left: -150,
                    top: -200,
                    backgroundColor: 'rgba(203,214,144,0.2)',
                    position: 'absolute',
                },]}/>
            <View style={{alignItems: 'flex-start', paddingHorizontal: '10%', paddingTop: '15%'}}>
                <Icon iconStyle={{color: 'black'}} name={'arrow-left'} type={'material-community'}
                      style={styles.back_arrow_p}
                      onPress={() => navigation.navigate('HomeTabs')}></Icon>
            </View>
            <View style={{alignItems: 'center'}}>
                <Icon
                    name='person-circle-outline'
                    iconStyle={{color: '#000', alignSelf: 'center'}}
                    type='ionicon'
                    size={100}
                />
            </View>
            <ScrollableBg style={{padding: '10%'}}>
                <Input
                    label={t('name')}
                    value={first_name}
                    onChangeText={(text) => {
                        setFirstName(text);
                        validateFirstName(text)
                    }}
                    errorStyle={{color: 'red'}}
                    errorMessage={firstNameErrorMessage}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                />
                <Input
                    label={t('surname')}
                    value={last_name}
                    onChangeText={(text) => {
                        setLastName(text);
                        validateLastName(text)
                    }}
                    errorStyle={{color: 'red'}}
                    errorMessage={lastNameErrorMessage}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                />
                <Input
                    label={t('id')}
                    value={dni.toString()}
                    onChangeText={(text) => {
                        setDni(text)
                        validateDNI(text)
                    }}
                    errorStyle={{color: 'red'}}
                    errorMessage={dniErrorMessage}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}

                />
                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t('sex')}</PaperText>
                <PaperButton mode="outlined"
                             style={[styles.input, {padding: 5, marginHorizontal: '3.5%', marginBottom: '5%'}]}
                             textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                             contentStyle={{justifyContent: 'flex-start'}} onPress={() => setSexGenderDialog(true)}>
                    {getSexGenderName(sexGender)}
                </PaperButton>
                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t('birthdate')}</PaperText>
                <View style={styles.datePicker}>
                    <DateTimePicker testID="dateTimePicker"
                                    value={new Date(date.getTime() + (date.getTimezoneOffset() * 60000))}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        handleDayPress(event, selectedDate)
                                        validateBirthDate(date)
                                    }}
                    />
                </View>
                <Button
                    title={t('savec')}
                    buttonStyle={{
                        backgroundColor: '#cbd690',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50
                    }}
                    containerStyle={{
                        width: 200,
                        marginVertical: 20,
                        alignSelf: 'center',
                    }}
                    titleStyle={{color: '#fff'}}
                    disabled={isButtonDisabled}
                    onPress={handleUpdateUser}
                />
            </ScrollableBg>
            <Portal>
                <Dialog style={{backgroundColor: '#E9F4E9FF'}}
                        visible={sexGenderDialog}
                        onDismiss={hideSexGenderDialog}>
                    <Picker
                        mode='dropdown'
                        selectedValue={sexGender}
                        onValueChange={(value: string) => {
                            setSexGender(value)
                            validateGender(value)
                        }}
                        placeholder='sex'
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {sexGenderOptions?.map((item) => (
                            <Picker.Item key={item.value} label={item.sex_gender_name} value={item.value}/>
                        ))}
                    </Picker>
                    <Dialog.Actions style={{justifyContent: 'space-between'}}>
                        <PaperButton textColor="#2E5829FF"
                                     onPress={hideSexGenderDialog}>
                            {t("close")}
                        </PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    )
}

export default EditAccount;