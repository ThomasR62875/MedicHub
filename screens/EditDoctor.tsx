import React, { useState, useEffect } from 'react'
import {getAllUsers, getSpecialties, getUserId, updateDoctor} from '../lib/supabase'
import {View, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, SafeAreaView, ScrollView} from 'react-native'
import {Button, Input, Text} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {DependentUser} from "../lib/types";
import {Specialty} from "../lib/types";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";

type EditDoctorProps = NativeStackScreenProps<RootStackParamList, 'EditDoctor'>;

const EditDoctor:React.FC<EditDoctorProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [specialties, setSpecialties] = useState<Specialty[] | null>(null);
    const [specialty,setSpecialty]= useState('')
    const [phone, setPhone] = useState('')
    const [addresses, setAddresses] = useState<[string]>([''])
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>(undefined)
    const [user_id, setUserId] = useState('')
    const [id, setId] = useState('')
    const {t} = useTranslation();
    const [nameErrorMessage, setNameErrorMessage] = useState('')
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

    useEffect(() => {
        if (session) getDoc()
    }, [session])

    async function getDoc() {
        setId(route.params.doc.id);
        setName(route.params.doc.name);
        setEmail(route.params.doc.email);
        setSpecialty(route.params.doc.specialty);
        setPhone(route.params.doc.phone);
        setAddresses(route.params.doc.addresses);
        setUserId(route.params.doc.user_id);
    }

    const handleUpdateDoctor = async () => {
        const session =  route.params.session;
        const doc  = {id: id , name: name, specialty: specialty, phone: phone, email: email, addresses: addresses, user_id: user_id}
        const result = await updateDoctor(doc);
        if (result.success) {
            navigation.navigate('AlertPublicity', { session, msg: 'editDoc', screen: 'SingleDoctor', doc: doc});
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const hideSpecialtyDialog = () => setSpecialtyDialog(false);
    const hideUserDialog = () => setUserDialog(false);


    const getUserName = (id: string) => {
        const selectedUser = all_users?.find(user => user.id === id);
        return selectedUser ? selectedUser.first_name : '';
    };
    return(
        <View>
            <KeyboardAvoidingView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                    <SafeAreaView style={styles.container}>
                        <ScrollView >
                            <View style={styles.topContent}>
                                <Text style={styles.titleText}>{t("modoctor")}</Text>
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
                                titleStyle={{ color: '#eef9ed' }}
                                disabled={isButtonDisabled}
                                onPress={handleUpdateDoctor}
                            />
                        </ScrollView>
                        <Portal>
                            <Dialog style={styles.dialog} visible={userDialog} onDismiss={hideUserDialog}>
                                <Text style={styles.dialogTitle}>{t('Seleccionar usuario')}</Text>
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
                    </SafeAreaView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
};

export default EditDoctor

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
        height: '200%',
        display: 'flex'
    },
    window: {
        alignItems: 'center',
        marginTop: '20%',
        marginLeft: '5%',
        marginRight: '5%'
    },
    pickerStyle: {
        marginBottom: 20,
    },
    verticallySpaced: {
        alignSelf: 'stretch',
    },
    title: {
        color: "4522345"
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
})
