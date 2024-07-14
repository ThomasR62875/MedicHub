import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    Text,
} from 'react-native';
import {addDoctor, getAllUsers, getSpecialties, getUserId} from "../lib/supabase";
import {Button, Icon, Input} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {DependentUser, Doctor} from "../lib/types";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import { Specialty } from '../lib/types';
import ScrollableBg from "../components/ScrollableBg";
import {styles} from "../assets/styles";
import { validateTextLength } from '../lib/ourlibrary';
// @ts-ignore
type AddDoctorProps = NativeStackScreenProps<RootStackParamList, 'AddDoctor'>


const AddDoctor: React.FC<AddDoctorProps> = ({navigation, route}:any) => {
    const session = route.params.session;
    const baseDoctor: Doctor = route.params.base_doctor;
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [specialties, setSpecialties] = useState<Specialty[] | null>(null);
    const [specialty,setSpecialty]= useState('')
    const [phone, setPhone] = useState('')
    const [addresses, setAddresses] = useState<[string]>([''])
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>(undefined)
    const [user_id, setUserId] = useState('')
    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const {t} = useTranslation();
    const [specialtyDialog, setSpecialtyDialog] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState<string>('');
    const [mailErrorMessage, setMailErrorMessage] = useState<string>('');
    const [addressErrorMessage, setAddressErrorMessage] = useState<string>('');
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const nameLength= 30;
    const phoneLength= 10;
    const emailLength= 30;
    const addressLength= 50;

    useEffect(() => {
        if (session){
            async function fetchData() {
                // @ts-ignore
                setSpecialties(await getSpecialties())
                setAllUsers(await getAllUsers(await getUserId()))
            }
            fetchData()
        }
        if (baseDoctor){
            setName(baseDoctor.name);
            setEmail(baseDoctor.email);
            setSpecialty(baseDoctor.specialty);
            setAddresses([baseDoctor.addresses[0]]);
            setPhone(baseDoctor.phone);
        }
    }, [session])

    useEffect(() => {
        if (
            name.trim() !== '' &&
            specialty.trim() !== '' &&
            user_id.trim() !== '' &&
            nameErrorMessage == '' &&
            phoneErrorMessage == '' &&
            mailErrorMessage == '' &&
            addressErrorMessage == ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, email ,specialty, user_id,phone,addresses]);

    const validateName = (value: string) => {
        let {result,msg}= validateTextLength(value,nameLength);
        if (value.trim() === '') {
            setNameErrorMessage(t('warnDocName'));
        } else if (!result) {
            setNameErrorMessage(msg);
        } else {
            setNameErrorMessage('');
        }
    };
    const validatePhone = (value: string) => {
        const containsLetterOrSymbol = /([a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-])/.test(value);
        let {result,msg}= validateTextLength(value,phoneLength);
        if (containsLetterOrSymbol) {
            setPhoneErrorMessage(t('warnPhone'));
        } else if (!result) {
            setPhoneErrorMessage(msg);
        } else {
            setPhoneErrorMessage('');
        }
    };
    const validateEmail = (value: string) => {
        let {result,msg}= validateTextLength(value,emailLength);
        if (value.trim() === '' || !value.includes("@") || !(value.includes(".edu") || value.includes(".com") || value.includes(".ar"))) {
            setMailErrorMessage(t('warn4'));
        } else if (!result) {
            setMailErrorMessage(msg);
        } else {
            setMailErrorMessage('');
        }
    };

    const validateAddressLength = (value: string) => {
        let {result,msg}= validateTextLength(value,addressLength);
        setAddressErrorMessage(msg);
    };

    const handleAddDoctor = async () => {
        const doctor = {
            name:name, specialty:specialty, phone:phone, email:email, addresses:
            addresses, user_id:user_id, id:''
        };


            const result = await addDoctor(doctor);
            if (result.success) {
                navigation.navigate('AlertPublicity', { session, msg: 'text10', screen: 'Doctors', appointment: null, du: null, doc: null, meds: null });
            } else {
                Alert.alert('Error', result.message || 'An unknown error occurred');
            }
    };

    const hideSpecialtyDialog = () => setSpecialtyDialog(false);
    const hideUserDialog = () => setUserDialog(false);


    const getUserName = (id: string) => {
        const selectedUser = all_users?.find(user => user.id === id);
        return selectedUser ? selectedUser.first_name : t('select_user');
    };


    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(134,171,186,0.6)'}]}>
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: '10%',
                    marginVertical: '20%',
                    alignItems: 'flex-start',
                }}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'}
                          style={styles.back_arrow}
                          onPress={() => navigation.navigate({name: 'Doctors', params: {session : session}})}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {
                        backgroundColor: 'rgba(134,171,186,0.6)',
                        alignSelf: 'center',
                        marginHorizontal: '35%'
                    }]} name={'stethoscope'} type={'material-community'}/>
                </View>
            </View>
            <ScrollableBg style={{padding: '10%'}}>
                <Input
                    label={t('name')}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}
                                    iconStyle={{fontSize: 20, paddingLeft: 10}}/>}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    onChangeText={(text) => {
                        setName(text);
                        validateName(text);
                    }}
                    value={name}
                    placeholder={t('name')}
                    autoCapitalize={'none'}
                    errorStyle={{color: 'red'}}
                    errorMessage={nameErrorMessage}
                />

                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t('specialty')}</PaperText>
                <PaperButton mode="outlined"
                             style={[styles.input, {padding: 5, marginHorizontal: '3.5%', marginBottom: '5%'}]}
                             textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                             contentStyle={{justifyContent: 'flex-start'}} onPress={() => setSpecialtyDialog(true)}>
                    {t(specialty)}
                </PaperButton>

                <Input
                    label={t('phone')}
                    leftIcon={{type: 'font-awesome', name: 'phone'}}
                    onChangeText={(text) => {
                        setPhone(text)
                        validatePhone(text);
                    }}
                    value={phone}
                    placeholder={t('phone')}
                    autoCapitalize={'none'}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={phoneErrorMessage}
                />

                <Input
                    label={t('email')}
                    leftIcon={{type: 'font-awesome', name: 'envelope'}}
                    onChangeText={(text) => {
                        setEmail(text);
                        validateEmail(text);
                    }}
                    value={email}
                    placeholder="Mail"
                    autoCapitalize={'none'}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={mailErrorMessage}
                />


                <Input
                    label={t('address')}
                    leftIcon={{type: 'font-awesome', name: 'map-marker'}}
                    onChangeText={(text) => {
                        setAddresses([text]);
                        validateAddressLength(text);
                    }}
                    value={addresses[0] || ''}
                    placeholder={t('address')}
                    autoCapitalize={'none'}
                    labelStyle={styles.label2}
                    placeholderTextColor={"#807d7d"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    inputStyle={{color: '#000', fontSize: 14, marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={addressErrorMessage}
                />

                <PaperText style={[styles.label2, {paddingLeft: 14}]}>{t("user")}</PaperText>

                <PaperButton mode="outlined"
                    style={[styles.input, {padding: 5, marginHorizontal: '3.5%', marginBottom: '5%'}]}
                    textColor='#000' labelStyle={{textAlign: 'left', display: 'flex'}}
                    contentStyle={{justifyContent: 'flex-start'}} onPress={() => setUserDialog(true)}>
                    {t('user')}
                </PaperButton>
                <Button
                    title={t('addoctor')}
                    buttonStyle={{
                        backgroundColor: '#86ABBA',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50
                    }}
                    containerStyle={{
                        width: 200,
                        marginHorizontal: '20%',
                        marginVertical: 10,
                        marginTop: 40,
                        alignContent: 'center'
                    }}
                    titleStyle={{color: '#fff'}}
                    disabled={isButtonDisabled}
                    onPress={handleAddDoctor}
                />
            </ScrollableBg>
            <Portal>
                <Dialog style={styles.dialog} visible={userDialog} onDismiss={hideUserDialog}>
                    <Text style={styles.dialogTitle}>{t('selectUser')}</Text>
                    <Picker
                        mode='dropdown'
                        selectedValue={user_id}
                        onValueChange={(value: string) => setUserId(value)}
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {all_users?.map((item) => (
                            <Picker.Item key={item.id} label={item.first_name} value={item.id} />
                        ))}
                    </Picker>
                </Dialog>
                <Dialog style={styles.dialog} visible={specialtyDialog} onDismiss={hideSpecialtyDialog}>
                    <Text style={styles.dialogTitle}>{t("selSpec")}</Text>
                    <Picker
                        mode='dropdown'
                        selectedValue={specialty}
                        onValueChange={(value: string) => setSpecialty(value)}
                        placeholder='Usuario'
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {specialties?.map((item) => (
                            <Picker.Item key={item.name} label={t(item.name)} value={item.name} />
                        ))}
                    </Picker>
                </Dialog>
            </Portal>
        </View>
    );
};

export default AddDoctor;
