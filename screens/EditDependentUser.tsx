import React, {useState, useEffect} from 'react'
import {updateDependentUser} from '../lib/supabase'
import {View, Alert, Text as RNText, Platform} from 'react-native'
import {Button, Icon, Input, Text} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Portal, Text as PaperText} from "react-native-paper";
import {Picker} from "@react-native-picker/picker";
import ScrollableBg from '../components/ScrollableBg';
import DateTimePicker from "@react-native-community/datetimepicker";
import {sexGenderOptions} from "../lib/ourlibrary";
import {styles} from "../assets/styles";

type EditDependentUserProps = NativeStackScreenProps<RootStackParamList, 'EditDependentUser'>;

const EditDependentUser: React.FC<EditDependentUserProps> = ({navigation, route}: any) => {
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
    const [birthDateErrorMessage, setBirthDateErrorMessage] = useState<string>('');
    const [genderErrorMessage, setGenderErrorMessage] = useState<string>('');
    const [showDatePickerUntil, setShowDatePickerUntil] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
            setDate(localDate);
        }
    };

    useEffect(() => {
        if (session) getDU()
    }, [session])


    const handleUpdateDependentUser = async () => {
        const session = route.params.session;
        const du = {
            id: id,
            first_name: first_name,
            last_name: last_name,
            dni: dni.toString(),
            birthdate: date,
            sex: sexGender
        }
        const result = await updateDependentUser(du);
        if (result.success) {
            navigation.navigate('AlertPublicity', {session, msg: 'editDepUser', screen: 'SingleDependentUser', du: du});
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    async function getDU() {
        setId(route.params.du.id)
        setFirstName(route.params.du.first_name);
        setLastName(route.params.du.last_name);
        setDni(route.params.du.dni);
        const birthdate = new Date(route.params.du.birthdate);
        setDate(birthdate);
        setSexGender(route.params.du.sex);

    }

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

    const validateBirthDate = (value: Date | undefined) => { // vamos a pedir q tenga minimo un día de vida
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        let birthdate = new Date();
        if (value) {
            birthdate = new Date(value);
        }
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

    const getBirthdate = () => {
        return date ? date.toLocaleDateString() : t('selectDate');
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
                          onPress={() => navigation.navigate('SingleDependentUser', {du: route.params.du})}></Icon>
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
                    value={first_name}
                    onChangeText={(text) => {
                        setFirstName(text);
                        validateFirstName(text)
                    }}
                    errorStyle={{ color: 'red' }}
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
                    errorStyle={{ color: 'red' }}
                    errorMessage={firstNameErrorMessage}
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
                    errorStyle={{ color: 'red' }}
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
                    {t(sexGender)}
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
                                        handleDateChange(event, selectedDate);
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
                                            handleDateChange(event, selectedDate);
                                            validateBirthDate(selectedDate);
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </View>

                </View>



                <View style={{alignItems: 'center'}}>
                    <Button
                        title={t('savec')}
                        buttonStyle={{
                            backgroundColor: '#8B86BE',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50
                        }}
                        containerStyle={{
                            width: 200,
                            marginVertical: 10,
                            marginTop: 40,
                            alignContent: 'center'
                        }}
                        titleStyle={{ color: '#fff' }}
                        onPress={handleUpdateDependentUser}
                    />
                </View>
            </ScrollableBg>
            <Portal>
                <Dialog style={styles.dialog} visible={sexGenderDialog} onDismiss={hideSexGenderDialog}>
                    <Text style={styles.dialogTitle}>{t("selSex")}</Text>
                    <Picker
                        mode='dropdown'
                        selectedValue={sexGender}
                        onValueChange={(value) => {
                            setSexGender(value)
                            validateGender(value)
                        }}
                        placeholder='sex'
                        enabled={true}
                        itemStyle={styles.pickerStyle}
                    >
                        {sexGenderOptions?.map((item) => (
                            <Picker.Item key={item.name} label={t(item.name)} value={item.name} />
                        ))}
                    </Picker>
                    <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                        <PaperButton textColor="#fff"
                                     onPress={hideSexGenderDialog}>
                            {t("close")}
                        </PaperButton>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

        </View>
    )
}

export default EditDependentUser
