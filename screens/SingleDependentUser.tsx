import React, {useEffect, useState} from 'react';
import {View, Text, Image, Alert, Text as RNText, Platform} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Icon, Button, Input} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Divider, Portal, Text as PaperText, TextInput} from "react-native-paper";
import {deleteDependentUser, getUserIdByEmail, setDependentUser, signUp} from "../lib/supabase";
import ScrollableBg from "../components/ScrollableBg";
import {User} from "../lib/types";
import {styles} from "../assets/styles";
// @ts-ignore
import Header from "../assets/header_violet.png";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";
import {Picker} from "@react-native-picker/picker";
import {getSexGenderName, sexGenderOptions} from "../lib/ourlibrary";

type SingleDependentUserProps = NativeStackScreenProps<RootStackParamList, 'SingleDependentUser'>


const SingleDependentUser: React.FC<SingleDependentUserProps> = ({navigation, route}: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
    const [shareDialog, setShareDialog] = React.useState(false);
    const [shareEmail, setShareEmail] = React.useState("");
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmed_password, setConfirmedPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dni, setDni] = useState<string>('')
    const [newIndepUserDialog, setNewIndepUserDialog] = React.useState(false);
    const [date, setDate] = useState(new Date());
    const [sexGender,setSexGender]= useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState<string>('');
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [mailErrorMessage, setMailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const [birthDateErrorMessage, setBirthDateErrorMessage] = useState<string>('');
    const [genderErrorMessage, setGenderErrorMessage] = useState<string>('');
    const [showDatePickerUntil, setShowDatePickerUntil] = useState(false);


    useEffect(() => {
        setFirstName(route.params.du.first_name)
        setLastName(route.params.du.last_name)
        setDni(route.params.du.dni.toString())
        const birthdate = new Date(route.params.du.birthdate);
        setDate(birthdate);
        setSexGender(route.params.du.sex)
    }, [firstName, lastName, dni, email, password, confirmed_password]);


    const handleDeleteDependentUser = async () => {
        const session = route.params.session;
        const {message} = await deleteDependentUser(route.params.du);
        navigation.navigate(t('dusers'), {session: session})
    };

    const {t} = useTranslation();

    function lowercaseFirstLetter(str: string) {
        if (!str) return str; // Handle empty strings or null
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    let str = t('depu');
    lowercaseFirstLetter(str);

    const hideSexGenderDialog = () => setSexGenderDialog(false);

    const handleUserSharing = async () => {
        const parent_id = await getUserIdByEmail(shareEmail);
        if (parent_id === undefined) {
            console.warn('Parent user not found');
            return;
        }

        const result = await setDependentUser(parent_id, route.params.du.id);
        if (!result) {
            console.error('Failed to set user sharing');
        }
    }

    const handleDayPress = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
            setDate(localDate);
        }
    };

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

    const signUpNewDependentUser = async (dependent_user_id: string) => {
        setLoading(true)
        const user: User = {
            birthdate: date,
            sex: sexGender,
            id: "",
            first_name: firstName,
            last_name: lastName,
            dni: dni,
            email: email,
            raw_user_meta_data: {
                dependent_user_id: dependent_user_id,
            }
        };

        const {success} = await signUp(user, password);
        if (success) Alert.alert(t('confirmationemailnotification'),)
        setLoading(false)

    };

    const getBirthdate = () => {
        return date ? date.toLocaleDateString() : t('selectDate');
    };

    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(139,134,190,0.6)'}]}>
                <View style={{flexDirection: 'row', marginHorizontal:'10%', marginVertical:'20%', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'} style={styles.back_arrow}
                          onPress={() => navigation.navigate(t('dusers'))}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {backgroundColor: 'rgba(139,134,190,0.6)', alignSelf: 'center'}]} name={'account'} type={'material-community'}/>
                    <Icon
                        name='pencil'
                        iconStyle={{color: '#fff'}}
                        type='ionicon'
                        size={25}
                        onPress={() => navigation.navigate('EditDependentUser', {du: route.params.du})}
                    />
                </View>
            </View>
            <ScrollableBg>
                <Text style={styles.titleText}>{route.params.du.first_name} {route.params.du.last_name}</Text>
                <Divider style={styles.divider}></Divider>
                <View style={{paddingHorizontal:'15%', paddingVertical:'10%'}}>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('id')}:</Text>
                        <Text style={styles.value}>{route.params.du.dni}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('birthdate')}:</Text>
                        <Text style={styles.value}>{new Date(route.params.du.birthdate).toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('sex')}:</Text>
                        <Text style={styles.value}>{getSexGenderName(route.params.du.sex)}</Text>
                    </View>
                    <View style={styles.screen}>
                        <View style={{alignItems: 'center', width: 'auto'}}>
                            <PaperButton
                                mode="outlined"
                                style={[styles.makeIndepUserBotton]}
                                textColor='#000'
                                labelStyle={{textAlign: 'left'}}
                                onPress={() => setNewIndepUserDialog(true)}
                            >{t('make_independent')}</PaperButton>
                            <PaperButton
                                mode="outlined"
                                style={styles.shareUserBotton}
                                textColor='#000'
                                labelStyle={{textAlign: 'left', display: 'flex'}}
                                onPress={() => setShareDialog(true)}
                            >{t('share_user')}</PaperButton>
                            <Button
                                title= {t('delete')}
                                buttonStyle={{
                                    backgroundColor: '#8b86be',
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
                                    marginTop: 20,
                                    marginBottom: 100
                                }}
                                titleStyle={{color: '#eef9ed'}}
                                onPress={() => showDialog()}
                            />
                        </View>
                    </View>
                </View>
            </ScrollableBg>


            {/*Dialogos */}
            <Dialog style={styles.dialog}
                    visible={visible}
                    onDismiss={hideDialog}>
                <Dialog.Content>
                    <Text style={[{textAlign: 'center'}, {fontSize: 18}]}>
                        {t('RUsureDU')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{justifyContent: 'space-between'}}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        {t('cancel')}
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteDependentUser}>
                        {t('delete')}
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>

            <Dialog style={styles.dialog}
                    visible={shareDialog}
                    onDismiss={() => setShareDialog(false)}>
                <Dialog.Actions>
                    <View>
                        <Text>{t('share_user_msg')}</Text>
                        <TextInput
                            label="Email"
                            value={shareEmail}
                            mode={'outlined'}
                            outlineStyle={{borderRadius: 10}}
                            style={styles.inputStyle}
                            onChangeText={text => setShareEmail(text)}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <PaperButton onPress={() => setShareDialog(false)}>{t('cancel')}</PaperButton>
                            <PaperButton onPress={() => handleUserSharing()}>{t('confirm')}</PaperButton>
                        </View>
                    </View>
                </Dialog.Actions>
            </Dialog>

            <Dialog style={styles.dialog}
                    visible={newIndepUserDialog}
                    onDismiss={() => setNewIndepUserDialog(false)}>
                <Dialog.Actions>
                    <ScrollableBg>
                        <Text style={[styles.text3, {fontWeight: 'bold'}]}>Ingrese los datos para mover este usario y sus datos a una nueva cuenta</Text>
                        <Input
                            label={t('name')}
                            labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5, fontWeight: 'normal', fontSize: 14, fontFamily: 'Roboto-Thin'}}
                            leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color} iconStyle={{fontSize: 20, paddingLeft: 10}} />}
                            onChangeText={(text) => {
                                setFirstName(text);
                                validateName(text)
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
                            labelStyle={{fontWeight: 'normal',color: '#000000', paddingBottom: 10, paddingLeft: 5}}
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
                            labelStyle={{fontWeight: 'normal',color: '#000000', paddingBottom: 10, paddingLeft: 5}}
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
                        <Input
                            label="Mail"
                            labelStyle={{fontWeight: 'normal',color: '#000000', paddingBottom: 10, paddingLeft: 5}}
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


                        <PaperText style={[styles.text4,{fontWeight: 'normal'}]}>{t('sex')}</PaperText>
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
                                                handleDayPress(event, selectedDate);
                                                validateBirthDate(selectedDate);
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
                                                    handleDayPress(event, selectedDate);
                                                    validateBirthDate(selectedDate);
                                                }}
                                            />
                                        )}
                                    </>
                                )}
                            </View>

                        </View>

                        <Portal>
                            <Dialog style={styles.dialog} visible={sexGenderDialog} onDismiss={hideSexGenderDialog}>
                                <Text style={styles.dialogTitle}>{t("selSex")}</Text>
                                <Picker
                                    mode='dropdown'
                                    selectedValue={sexGender}
                                    onValueChange={(value) => {
                                        setSexGender(value)
                                        validateGender(sexGender)
                                    }}
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



                        <Input
                            label={t('password')}
                            labelStyle={{fontWeight: 'normal',color: '#000000', paddingVertical: 12, paddingLeft: 5}}
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
                            labelStyle={{fontWeight: 'normal',color: '#000000', paddingBottom: 10, paddingLeft: 5}}
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
                                title={t('confirm')}
                                loading={loading}
                                buttonStyle={{
                                    backgroundColor: '#8B86BE',
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
                                    marginBottom: 100
                                }}
                                titleStyle={{color: '#eef9ed'}}
                                onPress={() => signUpNewDependentUser(route.params.du.id)}
                            />
                        </View>
                    </ScrollableBg>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default SingleDependentUser;
