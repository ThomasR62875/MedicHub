import React, { useState, useEffect } from 'react'
import {getDoctor, getUserSession, supabase, updateDependentUser} from '../lib/supabase'
import {View, Alert, StyleSheet} from 'react-native'
import {Button, Icon, Input, Text} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Calendar, DateData} from "react-native-calendars";
import {DependentUser, SexGenderOption, User} from "../lib/types";
import {Picker} from "@react-native-picker/picker";
import ScrollableBg from '../components/ScrollableBg';
import {navigate} from "expo-router/build/global-state/routing";
import DateTimePicker, {DateTimePickerEvent} from "@react-native-community/datetimepicker";



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
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);


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


    useEffect(() => {
        if(session){
            const fetchUser = async () => {
                const userData = await getUserSession(session.user.id);
                setId(userData.id)
                setFirstName(userData.first_name);
                setLastName(userData.last_name);
                setDni(userData.dni);

                const birthdateWithTime = new Date(userData.birthdate);
                birthdateWithTime.setUTCHours(1, 0, 0, 0);
                setDate(birthdateWithTime);

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

    const handleDayPress = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (event.type === "set" && selectedDate) {
            const birthdateWithTime = new Date(selectedDate);
            birthdateWithTime.setUTCHours(1, 0, 0, 0);
            setDate(birthdateWithTime);
        }
    };

    return(
        <ScrollableBg>
            <View style={styles.container} >
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
                            labelStyle={styles.text}
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
                            labelStyle={styles.text}
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
                        labelStyle={styles.text}
                    />
                    <PaperText style={[styles.text, {marginLeft: "2%"}]}>{t('sex')}</PaperText>
                    <PaperButton mode="outlined" style={styles.pickerButton} textColor='#2E5829' labelStyle={{textAlign: 'left', display:'flex'}} onPress={()=> setSexGenderDialog(true)}>
                        {getSexGenderName(sexGender)}
                    </PaperButton>
                    <PaperText style={[styles.text, {marginLeft: "2%"}]}>{t('birthdate')}</PaperText>
                    <View style={styles.datePicker}>
                        <DateTimePicker  testID="dateTimePicker"
                                         value={date ? date : new Date()}
                                         mode="date"
                                         display="default"
                                         onChange={(event, selectedDate) => handleDayPress(event, selectedDate)}
                        />
                    </View>
                    <Portal>
                        <Dialog style={{ backgroundColor: '#E9F4E9FF' }}
                                visible={sexGenderDialog}
                                onDismiss={hideSexGenderDialog}>
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
                            <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                                <PaperButton textColor="#2E5829FF"
                                             onPress={hideSexGenderDialog}>
                                    {t("close")}
                                </PaperButton>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
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
                            marginVertical: 20,
                            alignSelf: 'center',
                        }}
                        titleStyle={{ color: '#eef9ed' }}
                        disabled={isButtonDisabled}
                        onPress={handleUpdateUser}
                    />
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
    datePicker: {
        alignSelf: 'center',
        marginTop: "5%",
    },
    pickerButton: {
        borderRadius: 6,
        marginLeft: '5%',
        marginRight: '5%',
    },
    dialog: {
        backgroundColor: "#e9f4e9"
    },
    pickerStyle: {
        marginBottom: 20,
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 16,
        marginTop: "5%",
        marginBottom: '2%',
        color: "#808080",
        width: "60%"
    },
})