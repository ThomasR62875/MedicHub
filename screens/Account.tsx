import React, { useState, useEffect } from 'react'
import { getUser, getUserId, supabase } from '../lib/supabase'
import {StyleSheet, View, ScrollView} from 'react-native'
import {Button, Icon} from 'react-native-elements'
import LanguageButton from '../components/LanguageButton'
import {DependentUser, SexGenderOption} from "../lib/types";
import {Dialog, Text, Button as PaperButton, Text as PaperText} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {Calendar, DateData} from "react-native-calendars";
import {Picker} from "@react-native-picker/picker";


const Account: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [dni, setDni] = useState(0);
    const [date, setDate] = useState<Date>();
    const [sexGender,setSexGender]= useState('');
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const [visible, setVisible] = React.useState(false);
    const {t} = useTranslation();
    const sexGenderOptions: SexGenderOption[] = [
        { sex_gender_name: t('male'), value: 'male' },
        { sex_gender_name: t('female'), value: 'female' },
        { sex_gender_name: t('non-binary'), value: 'non-binary' },
        { sex_gender_name: t('other'), value: 'other' },
    ];


    useEffect(() => {
        if (session) {
            async function fetchData() {
                const data : DependentUser= await getUser(await getUserId())
                setFirstName(data.first_name)
                setLastName(data.last_name)
                if (data.birthdate) {
                    const birthdate = new Date(data.birthdate);
                    setDate(birthdate);
                } else {
                    setDate(undefined);
                }
                setSexGender(data.sex)
                const dniString = String(data.dni);
                if (dniString && dniString.length >= 8) {
                    const dniNumber = parseInt(dniString.slice(0, 8), 10);
                    setDni(dniNumber);
                } else {
                    console.error('El DNI no es una cadena válida o no tiene al menos 8 caracteres.');
                }
            }
            fetchData()
        }
    }, [session])

    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);

    const getSexGenderName = (value: string) => {
        if(value == null)
            return ''
        const option = sexGenderOptions.find(option => option.value === value);
        return option ? option.sex_gender_name : '';
    };


    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.topContent}>
                    <Text style={styles.screenTitle}>{t('account')}</Text>
                </View>
                <View style={styles.main}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name='person-circle-outline'
                            iconStyle={{ color: '#1e3a1a' }}
                            type='ionicon'
                            size={125}
                        />
                    </View>
                    <View style={styles.namesContainer}>
                        <Text style={styles.name}>{first_name}</Text>
                        <Text style={styles.name}>{last_name}</Text>
                    </View>
                    <View style={{marginTop: "12%", marginLeft: '20%'}}>
                        <Icon
                            name='pencil'
                            iconStyle={{ color: '#1E3A1AFF' }}
                            type='ionicon'
                            size={25}
                            style={{margin: "5%"}}
                            onPress={() => navigation.navigate('EditAccount', {session: session})}
                        />
                    </View>
                </View>
                <View style={{marginTop: 5, marginLeft: "10%", marginBottom: "5%"}}>
                        <Text style={styles.title}>Mail:</Text>
                        <Text style={styles.text2}>{session?.user.email}</Text>
                    <View style={{marginTop: 5}}/>
                        <Text style={styles.title}>{t('id')}:</Text>
                        <Text style={styles.text2}>{dni}</Text>
                    <View style={{marginTop: 5}}/>
                        <Text style={styles.title}>{t('birthdate')}:</Text>
                        <Text style={styles.text2}>{date ? date.toISOString().split('T')[0] : ' '}</Text>
                    <View style={{marginTop: 5}}/>
                        <Text style={styles.title}>{t('sex')}:</Text>
                        <Text style={styles.text2}>{getSexGenderName(sexGender)}</Text>
                </View>
                    <View style={{marginTop: 5, alignItems: 'center', marginBottom: 5}}>
                        <LanguageButton/>
                    </View>
                <View style={{alignItems: 'center', width: 'auto', alignSelf: 'center'}}>
                    <Button
                        title={t('mdocs')}
                        icon={{
                            name: 'doctor',
                            type: 'material-community',
                            size: 20,
                            color: '#12210f',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,

                        }}
                        onPress={() => navigation.navigate({name: 'Doctors', params: {session: session}})}/>
                    <Button
                        title={t('mappointments')}
                        icon={{
                            name: 'archive-clock',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,

                        }}
                        onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}/>
                    <Button
                        title={t('mvaccines')}
                        icon={{
                            name: 'needle',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,
                        }}/>
                    <Button
                        title={t('mmedicine')}
                        icon={{
                            name: 'pill',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,
                        }}
                        onPress={() => navigation.navigate({name: 'Medication', params: {session: session}})}/>
                    <Button
                        title={t('mfiles')}
                        icon={{
                            name: 'archive',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,
                        }}/>
                    <Button
                        title={t('logout')}
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
                        onPress={()=>showDialog()}/>
                </View>
                <Dialog style={{ backgroundColor: '#E9F4E9FF' }}
                    visible={visible}
                    onDismiss={hideDialog}>
                    <Dialog.Content>
                        <Text variant="bodyMedium" style={[{textAlign: 'center'}, {fontSize: 18}]}>
                            {t("closeSes")}
                        </Text>
                    </Dialog.Content>
                    <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                        <PaperButton textColor="#2E5829FF"
                            onPress={hideDialog}>
                            Cancelar
                        </PaperButton>
                        <PaperButton textColor="#b6265d"
                            onPress={() => supabase.auth.signOut()}>
                            Cerrar sesión
                        </PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </ScrollView>
        </View>
    )
}


export default Account

const styles = StyleSheet.create({
    cerrarSesion:{
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#073A29',
        borderRadius: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        marginLeft: 10,
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    misCosas: {
        width: 225,
        backgroundColor: '#cae4c8',
        borderColor: '#cae4c8',
        borderWidth: 1,
        color: 'black',
        borderRadius: 17,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: "2%"
    },
    text2: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        marginTop: "1%",
        color: "#1a4212",
        width: "60%"
    },
    title: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        marginTop: "1%",
        color: "#245e1e",
        width: "60%"
    },
    buttonText: {
        alignSelf: 'center',
        color: '#12210f',
        fontSize: 20,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        padding: 20,
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        color: 'white',
    },
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
    topContent: {
        alignItems: "center",
        marginTop: "25%",
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        marginBottom: "5%",
        color: "#2E5829FF",
        width: "60%"
    },
    main: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        marginLeft: '5%'
    },
    iconContainer: {
        alignItems: 'flex-start',
    },
    name: {
        color: "#2E5829FF",
        fontSize: 20,
    },
    namesContainer: {
        marginLeft: "2%",
        marginTop: '10%'
    }, icons: {
        color: '#2E5829FF',
    },
    buttonContainer: {
        width: 225, // Ancho deseado para todos los botones
        marginVertical: 10,
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
})