import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    SafeAreaView, Text, Platform
} from 'react-native';
import {addDoctor, getAllUsers, getSpecialties, getUserId} from "../lib/supabase";
import {Button, Input} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {DependentUser} from "../lib/types";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import { Specialty } from '../lib/types';
type AddDoctorProps = NativeStackScreenProps<RootStackParamList, 'AddDoctor'>


const AddDoctor: React.FC<AddDoctorProps> = ({navigation, route}) => {
    const session = route.params.session;
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                    <View>
                        <View style={styles.topContent}>
                            <Text style={styles.titleText}>{t('addoctor')}</Text>
                        </View>
                        <PaperText style={styles.text}>Nombre</PaperText>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            onChangeText={(text) => {
                                setName(text);
                                validateName(text);
                            }}
                            value={name}
                            placeholder={t('name')}
                            autoCapitalize={'none'}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nameErrorMessage}
                        />

                        <PaperText style={styles.text}>{t('specialty')}</PaperText>
                        <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setSpecialtyDialog(true)}>
                            {t(specialty)}
                        </PaperButton>

                        <PaperText style={styles.text}>{t('phone')}</PaperText>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'phone' }}
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                            placeholder={t('phone')}
                            autoCapitalize={'none'}
                        />
                        <PaperText style={styles.text}>{t("email")}</PaperText>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="Mail"
                            autoCapitalize={'none'}
                        />
                        <PaperText style={styles.text}>{t("address")}</PaperText>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'map-marker' }}
                            onChangeText={(text) => setAddresses([text])}
                            value={addresses[0] || ''}
                            placeholder={t('address')}
                            autoCapitalize={'none'}
                        />

                        <PaperText style={styles.text}>{t("user")}</PaperText>
                        <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setUserDialog(true)}>
                            {getUserName(user_id)}
                        </PaperButton>
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
                                marginBottom: '80%',
                                alignSelf: 'center',
                            }}
                            titleStyle={{ color: '#eef9ed' }}

                            onPress={handleAddDoctor}
                        />
                    </View>
                </ScrollView>
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
                </SafeAreaView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>

    );
};

export default AddDoctor;


const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
        height: '200%',
        display: 'flex'
    },
    containerTotal:{
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    topContent: {
        marginTop: '15%',
        marginBottom: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "70%"
    },
    verticallySpaced: {
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 5,
    },
    horizontallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
    },
    textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
        fontSize: 20,
    },
    pickerStyle: {
        marginBottom: 20,
    },
    pickerButton: {
        borderRadius: 6,
        marginLeft: '5%',
        marginRight: '5%',
        minHeight: '5%'
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
    }

});
