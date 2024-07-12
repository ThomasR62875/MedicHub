import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Alert} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Icon, Button, Input} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Divider, TextInput} from "react-native-paper";
import {deleteDependentUser, getUserIdByEmail, setDependentUser} from "../lib/supabase";
import ScrollableBg from "../components/ScrollableBg";
import {SexGenderOption} from "../lib/types";
import {styles} from "../assets/styles";
// @ts-ignore
import Header from "../assets/header_violet.png";

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
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);


    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState<string>('');
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [mailErrorMessage, setMailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');


    useEffect(() => {
        if (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            dni.trim() !== '' &&
            email.trim() !== '' &&
            password.trim() !== '' &&
            confirmed_password.trim() !== '' &&
            nameErrorMessage === '' &&
            lastNameErrorMessage === '' &&
            DNIErrorMessage === '' &&
            mailErrorMessage === '' &&
            passwordErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
        setFirstName(route.params.du.first_name)
        setLastName(route.params.du.last_name)
        console.log("entrando:"+ route.params.du.dni)
        setDni(route.params.du.dni.toString())
    }, [firstName, lastName, dni, email, password, confirmed_password]);


    const handleDeleteDependentUser = async () => {
        const session = route.params.session;
        const {success,message} = await deleteDependentUser(route.params.du);
        Alert.alert(message,'',[{text: 'Ok', onPress: () => navigation.navigate('Usuarios', {session: session})}])
    };

    const {t, i18n} = useTranslation();

    function lowercaseFirstLetter(str: string) {
        if (!str) return str; // Handle empty strings or null
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    let str = t('depu');
    str = lowercaseFirstLetter(str);

    const sexGenderOptions: SexGenderOption[] = [
        { sex_gender_name: t('male'), value: 'male' },
        { sex_gender_name: t('female'), value: 'female' },
        { sex_gender_name: t('non-binary'), value: 'non-binary' },
        { sex_gender_name: t('other'), value: 'other' },
    ];

    const getSexGenderName = (value: string) => {
        const option = sexGenderOptions.find(option => option.value === value);
        return option ? option.sex_gender_name : '';
    };
    const handleUserSharing = async () => {
        const parent_id = await getUserIdByEmail(shareEmail);
        if (parent_id === undefined) {
            console.log('Parent user not found');
            return;
        }

        const result = await setDependentUser(parent_id, route.params.du.id);
        if (result) {
            console.log('User sharing set successfully');
        } else {
            console.log('Failed to set user sharing');
        }
    }

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


    return (
        <View style={styles.tab}>
            <Image source={Header} style={styles.header}/>

            <Icon iconStyle={{color: 'white', paddingVertical:20}} name={'arrow-left'} type={'material-community'} style={styles.back_arrow}
                  onPress={() => navigation.navigate('HomeTabs')}></Icon>
            <View style={{flexDirection: 'row', paddingTop:'5%', marginLeft:'10%', alignItems: 'center', justifyContent: 'center'}}>
                <Icon iconStyle={{color: 'white', fontSize: 24}} containerStyle={[styles.circleHeader, {backgroundColor: 'rgba(139,134,190,0.6)', alignSelf: 'center', marginHorizontal: "10%"}]} name={'account'} type={'material-community'}/>
                <Icon
                name='pencil'
                iconStyle={{color: '#fff', paddingLeft: 20, paddingBottom: 25}}
                type='ionicon'
                size={25}
                onPress={() => navigation.navigate('EditDependentUser', {du: route.params.du})}
                />
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
                        <Text style={styles.value}>{route.params.du.birthdate}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('sex')}:</Text>
                        <Text style={styles.value}>{getSexGenderName(route.params.du.sex)}</Text>
                    </View>
                    <View style={styles.screen}>
                        <View style={{alignItems: 'center', width: 'auto'}}>
                            <PaperButton
                                mode="outlined"
                                style={styles.makeIndepUserBotton}
                                textColor='#2E5829'
                                labelStyle={{textAlign: 'left', display: 'flex'}}
                                onPress={() => setNewIndepUserDialog(true)}
                            >{t('make_independent')}</PaperButton>
                            <PaperButton
                                mode="outlined"
                                style={styles.shareUserBotton}
                                textColor='#2E5829'
                                labelStyle={{textAlign: 'left', display: 'flex'}}
                                onPress={() => setShareDialog(true)}
                            >{t('share_user')}</PaperButton>
                            <Button
                                title="Eliminar"
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
                <Dialog.Actions style={{justifyContent: 'center'}}>
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
                        <Text>Ingrese el mail del usario con el que desea compartir</Text>
                        <TextInput
                            label="Email"
                            value={shareEmail}
                            mode={'outlined'}
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
                        <Text style={styles.title}>Ingrese los datos para mover este usario y sus datos a una nueva cuenta</Text>
                        <Input
                            label={t('name')}
                            labelStyle={styles.colorLabel}
                            leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}/>}
                            onChangeText={(text) => {
                                setFirstName(text);
                                validateName(text)
                            }}
                            value={firstName}
                            placeholder={t('name')}
                            placeholderTextColor={"#407738"}
                            autoCapitalize={'none'}
                            inputStyle={{color: '#407738', marginLeft: 10}}
                            errorStyle={{color: 'red'}}
                            errorMessage={nameErrorMessage}
                        />
                        <Input
                            label={t('surname')}
                            labelStyle={styles.colorLabel}
                            leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}/>}
                            onChangeText={(text) => {
                                setLastName(text);
                                validateLastName(text)
                            }}
                            value={lastName}
                            placeholder={t('surname')}
                            autoCapitalize={'none'}
                            placeholderTextColor={"#407738"}
                            inputStyle={{color: '#407738', marginLeft: 10}}
                            errorStyle={{color: 'red'}}
                            errorMessage={lastNameErrorMessage}
                        />
                        <Input
                            label={t('id')}
                            labelStyle={styles.colorLabel}
                            leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon}/>}
                            onChangeText={(text) => {
                                setDni(text);
                                validateDNI(text);
                            }}
                            value={dni}
                            placeholder={t('id')}
                            autoCapitalize={'none'}
                            placeholderTextColor={"#407738"}
                            inputStyle={{color: '#407738', marginLeft: 10}}
                            errorStyle={{color: 'red'}}
                            errorMessage={DNIErrorMessage}
                        />
                        <Input
                            label="Mail"
                            labelStyle={styles.colorLabel}
                            leftIcon={<Icon type="font-awesome" name="envelope" color={styles.colorIcon.color}/>}
                            onChangeText={(text) => {
                                setEmail(text);
                                validateEmail(text)
                            }}
                            value={email}
                            placeholder="email@address.com"
                            autoCapitalize={'none'}
                            placeholderTextColor={"#407738"}
                            inputStyle={{color: '#407738', marginLeft: 10}}
                            errorStyle={{color: 'red'}}
                            errorMessage={mailErrorMessage}
                        />
                        <Input
                            label={t('password')}
                            labelStyle={styles.colorLabel}
                            leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color}/>}
                            onChangeText={(text) => setPassword(text)}
                            value={password}
                            secureTextEntry={true}
                            placeholder={t('password')}
                            autoCapitalize={'none'}
                            inputStyle={{color: '#407738', marginLeft: 10}}
                            placeholderTextColor={"#407738"}
                        />
                        <Input
                            label={t('confirmp')}
                            labelStyle={styles.colorLabel}
                            leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color}/>}
                            onChangeText={(text1) => {
                                setConfirmedPassword(text1);
                                validatePassword(text1);
                            }}
                            value={confirmed_password}
                            secureTextEntry={true}
                            placeholder={t('password')}
                            autoCapitalize={'none'}
                            inputStyle={{color: '#407738', marginLeft: 10}}
                            placeholderTextColor={"#407738"}
                            errorStyle={{color: 'red'}}
                            errorMessage={passwordErrorMessage}
                        />
                        <View style={{alignItems: 'center'}}>
                            <Button
                                title={t('confirm')}
                                disabled={isButtonDisabled}
                                loading={loading}
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
                                    marginBottom: 100
                                }}
                                titleStyle={{color: '#eef9ed'}}
                                onPress={handleDeleteDependentUser}
                            />
                        </View>
                    </ScrollableBg>
                </Dialog.Actions>
            </Dialog>
        </View>
        // <View style={styles.container}>
        //     <View style={styles.titleContainer}>
        //         {i18n.language === 'english' ? (
        //             <Text style={styles.titleText}>{t('depu')} {t('text2')} </Text>
        //         ) : (
        //             <View>
        //                 <Text style={styles.titleText}>{t('text2')}</Text>
        //                 <Text style={styles.titleText}>{str}</Text>
        //             </View>
        //         )
        //         }
        //     </View>
        //     <View style={styles.addContainer}>

        //     </View>
        //     <View style={styles.detailRow}>
        //         <Text style={styles.label}>{t('name')}:</Text>
        //         <Text style={styles.value}>{route.params.du.first_name}</Text>
        //     </View>
        //     <View style={styles.detailRow}>
        //         <Text style={styles.label}>{t('surname')}:</Text>
        //         <Text style={styles.value}>{route.params.du.last_name}</Text>
        //     </View>

        //         </View>
        //     </View>

        // </View>
    );
};

export default SingleDependentUser;
//
// // @ts-ignore
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#e9f4e9',
//     },
//     titleContainer: {
//         fontSize: 25,
//         fontWeight: 'bold',
//         marginTop: 10,
//         alignSelf: 'center',
//         marginBottom: 20,
//     },
//     titleText: {
//         fontSize: 25,
//         textAlign: 'center',
//         justifyContent: 'center',
//         fontWeight: 'bold',
//     },
//     detailRow: {
//         flexDirection: 'row',
//         marginBottom: 10,
//     },
//     label: {
//         fontWeight: 'bold',
//         marginRight: 5,
//     },
//     value: {
//         flex: 1,
//     },
//     addContainer: {
//         left: 290,
//         bottom: 60,
//         alignSelf: 'flex-start',
//     },
//     screen: {
//         backgroundColor: "#E9F4E9FF",
//         height: "100%",
//     },
//     dialog: {
//         height: '90%',
//         backgroundColor: '#E9F4E9FF',
//         alignItems: 'center',
//     },
//     shareUserBotton: {
//         borderRadius: 6,
//         margin: '5%',
//         width: '60%'
//     },
//     inputStyle: {
//         marginTop: '5%',
//         marginBottom: '5%',
//     },
//     buttonSignInContainer: {
//         width: '50%',
//         justifyContent: 'center',
//     },
//     buttonSignIn: {
//         backgroundColor: '#B5DCCA',
//         borderRadius: 10,
//         justifyContent: 'center',
//     },
//     colorIcon: {
//         color: '#2E5829FF'
//     },
//     colorLabel: {
//         color: '#2E5829FF',
//         fontSize: 12
//     },
//     icon: {
//         width: 24,
//         height: 24,
//     }, registerW: {
//         backgroundColor: '#e9f4e9',
//         height: '100%',
//         marginLeft: 10,
//         marginRight: 10,
//         alignContent: 'center'
//     },
//     title: {
//         color: '#2E5829FF',
//         textAlign: 'center',
//         marginBottom: '15%',
//         marginTop: 0,
//         fontSize: 14,
//         fontWeight: 'bold'
//     },
//     logo: {
//         height: 50,
//         width: 50,
//         marginBottom: 0
//     },
//     makeIndepUserBotton: {
//         borderRadius: 6,
//         margin: '5%',
//     }
// });
