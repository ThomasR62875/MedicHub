import React, { useState, useEffect } from 'react'
import {getDoctor, getUserSession, supabase, updateDependentUser} from '../lib/supabase'
import {View, Alert, StyleSheet} from 'react-native'
import {Button, Icon, Input, Text} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Text as PaperText} from "react-native-paper";
import {Calendar, DateData} from "react-native-calendars";
import {DependentUser, SexGenderOption, User} from "../lib/types";
import {Picker} from "@react-native-picker/picker";
import ScrollableBg from '../components/ScrollableBg';
import {navigate} from "expo-router/build/global-state/routing";



type EditAccountProps = NativeStackScreenProps<RootStackParamList, 'EditAccount'>;


const EditAccount:React.FC<EditAccountProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState('');
    const [first_name,setFirstName] = useState('');
    const [last_name,setLastName] = useState('');
    const [dni,setDni]  = useState('');
    const [date, setDate] = useState(new Date());
    const [sexGender,setSexGender]= useState('');
    const [user, setUser] = useState<DependentUser>();
    const [sexGenderDialog, setSexGenderDialog] = useState(false);
    const {t} = useTranslation();

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [dniErrorMessage, setDniErrorMessage] = useState('')

    const sexGenderOptions: SexGenderOption[] = [
        { sex_gender_name: t('male'), value: 'male' },
        { sex_gender_name: t('female'), value: 'female' },
        { sex_gender_name: t('non-binary'), value: 'non-binary' },
        { sex_gender_name: t('other'), value: 'other' },
    ];


    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const stringDay = day.toString();
        return `${year}-${month}-${stringDay}`;
    };
    const currentDate = getCurrentDate();
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const handleDayPress = (date: DateData) => {
        // @ts-ignore
        setSelectedDate(date.dateString)
        setDate(new Date(date.dateString));
    };

    useEffect(() => {
        if (
            first_name.trim() !== '' &&
            last_name.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [first_name, last_name, dni]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);


    useEffect(() => {
        if(session){
            const fetchUser = async () => {
                const userData = await getUserSession(session.user.id);
                setId(userData.id)
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setDni(userData.dni);
                setDate(userData.birthdate);
                setSexGender(userData.sex);
            };
            fetchUser();
        }
    }, [session])


    const handleUpdateUser = async () => {
        console.log(sexGender)
        console.log(date)
        const us  = {id: id , first_name: first_name, last_name: last_name, dni: dni, birthdate: date, sex: sexGender}
        const result = await updateDependentUser(us);
        if (result.success) {
            Alert.alert(
                t('editDepUser'),
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Perfil', { session: session })}
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };


    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setFirstNameErrorMessage(t('warn17'));
        } else {
            setFirstNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn18'));
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        if (value.trim() === '') {
            setDniErrorMessage(t('warn19'));
        } else {
            setDniErrorMessage('');
        }
    };



    const hideSexGenderDialog = () => setSexGenderDialog(false);

    const getSexGenderName = (value: string) => {
        const option = sexGenderOptions.find(option => option.value === value);
        return option ? option.sex_gender_name : '';
    };

    const markedDatesString = {
        [selectedDate]: {
            selected: true,
            selectedColor: '#073A29',
        },
    };

    const customTheme = {
        arrowColor: '#00A36C',
        todayTextColor: '#00A36C',
    }

    return(
        <ScrollableBg>
            <View style={styles.container} >
                <View style={styles.window}>
                    <Icon name='person-circle-outline' iconStyle={{color: '#12230f', marginBottom: '10%'}} type='ionicon' size={90}/>
                    {/* aca iria una carga de archivo/imagen q tdv no sabemos hacer todo*/}
                        <Input
                            label={t('name')}
                            value={first_name}
                            onChangeText={(text) => {
                                setFirstName(text);
                                validateFirstName(text)
                            }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={firstNameErrorMessage}
                        />
                        <Input
                            label={t('surname')}
                            value={last_name}
                            onChangeText={(text) => {
                                setLastName(text);
                                validateLastName(text)
                            }}
                            errorStyle={{ color: 'red' }}
                            errorMessage={firstNameErrorMessage}
                        />
                    <Input
                        label={t('id')}
                        value={dni.toString()}
                        onChangeText={(text) => {
                            setDni(text)
                            validateDNI(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={dniErrorMessage}
                    />
                    <PaperText style={styles.text}>{t('sex')}</PaperText>
                    <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setSexGenderDialog(true)}>
                        {getSexGenderName(sexGender)}
                    </PaperButton>
                    <PaperText style={styles.text}>{t('birthdate')}</PaperText>
                    <View style={styles.calendarContainer}>
                        <Calendar style={{borderRadius: 10}}
                                  markingType={'custom'}
                                  onDayPress={handleDayPress}
                                  markedDates={markedDatesString}
                                  theme={customTheme}
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
                        onPress={handleUpdateUser}
                    />
                </View>
            </View>
        </ScrollableBg>
    )
}

export default EditAccount

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        alignContent: 'center'
    },
    window: {
        alignItems: 'center',
        marginTop: '20%',
        marginLeft: '5%',
        marginRight: '5%'
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