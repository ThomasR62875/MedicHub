import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    Text,
    Image
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
// @ts-ignore
import Header from "../assets/header_blue.png";
type AddDoctorProps = NativeStackScreenProps<RootStackParamList, 'AddDoctor'>


const AddDoctor: React.FC<AddDoctorProps> = ({navigation, route}) => {
    const session = route.params.session;
    const baseDoctor:Doctor = route.params.base_doctor;
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

    useEffect(() => {
        if (
            name.trim() !== '' &&
            nameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, specialty]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

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

    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage(t('warn1'));
        } else {
            setNameErrorMessage('');
        }
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
            <Image source={Header} style={styles.header}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, margin: '5%', marginBottom: '2.5%'}}>
                <Icon iconStyle={{color: 'white', paddingVertical: 20}} name={'arrow-left'} type={'material-community'} style={styles.back_arrow} onPress={() => navigation.navigate({name: 'Doctors', params: {session : session}})}></Icon>
            </View>
            <View style={{
                flexDirection: 'row',
                paddingTop: '5%',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon iconStyle={{color: 'white', fontSize: 24}} containerStyle={[styles.circleHeader, {
                    backgroundColor: 'rgba(134,171,186,0.6)',
                    alignSelf: 'center',
                    marginHorizontal: "10%"
                }]} name={'stethoscope'} type={'material-community'}/>
            </View>
            <ScrollableBg style={{padding: '10%'}}>
                <PaperText style={styles.text}>{t('name')}</PaperText>
                <Input
                    leftIcon={{type: 'font-awesome', name: 'user'}}
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

                <PaperText style={styles.text}>{t('specialty')}</PaperText>
                <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829'
                             labelStyle={{textAlign: 'left', display: 'flex'}} onPress={() => setSpecialtyDialog(true)}>
                    {t(specialty)}
                </PaperButton>

                <PaperText style={styles.text}>{t('phone')}</PaperText>
                <Input
                    leftIcon={{type: 'font-awesome', name: 'phone'}}
                    onChangeText={(text) => setPhone(text)}
                    value={phone}
                    placeholder={t('phone')}
                    autoCapitalize={'none'}
                />

                <PaperText style={styles.text}>{t("email")}</PaperText>
                <Input
                    leftIcon={{type: 'font-awesome', name: 'envelope'}}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="Mail"
                    autoCapitalize={'none'}
                />

                <PaperText style={styles.text}>{t("address")}</PaperText>
                <Input
                    leftIcon={{type: 'font-awesome', name: 'map-marker'}}
                    onChangeText={(text) => setAddresses([text])}
                    value={addresses[0] || ''}
                    placeholder={t('address')}
                    autoCapitalize={'none'}
                />

                <PaperText style={styles.text}>{t("user")}</PaperText>
                <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829'
                             labelStyle={{textAlign: 'left', display: 'flex'}} onPress={() => setUserDialog(true)}>
                    {getUserName(user_id)}
                </PaperButton>
                <Button
                    title={t('addoctor')}
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
                    titleStyle={{color: '#eef9ed'}}
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
