import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    Image
} from 'react-native';
import {signUp} from "../lib/supabase";
import {Input, Icon, Button} from "react-native-elements";
// @ts-ignore
import Logo from '../assets/icon_black.png'
import {useTranslation} from "react-i18next";
import ScrollableBg from "../components/ScrollableBg";
import {User} from '../lib/types';


const Register: React.FC = ({navigation}: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmed_password, setConfirmedPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dni, setDni] = useState('')

    const [nameErrorMessage, setNameErrorMessage] = useState<string>('');
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState<string>('');
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const [mailErrorMessage, setMailErrorMessage] = useState<string>('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<string>('');
    const {t} = useTranslation();

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
        } else {
        }
    }, [firstName, lastName, dni, email, password, confirmed_password]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
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

    async function signUpWithEmail() {
        setLoading(true)
        const user: User = {id: "", first_name: firstName, last_name: lastName, dni: dni, email: email}
        const {success, message} = await signUp(user, password);

        if (success) Alert.alert('¡Revise su bandeja de entrada para verificar el mail!',)
        setLoading(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: '#fff', marginBottom: 0}}>
            {/* Burbuja 1 */}
            <View
                style={[
                    styles.bubble,
                    {
                        width: 250,
                        height: 250,
                        borderRadius: 125,
                        left: 200,
                        top: -50,
                        backgroundColor: 'rgba(236,183,97,0.2)',
                    },
                ]}
            />
            {/* Burbuja 2 */}
            <View
                style={[
                    styles.bubble,
                    {
                        width: 400,
                        height: 400,
                        borderRadius: 200,
                        left: -60,
                        top: -200,
                        backgroundColor: 'rgba(236,183,97,0.2)',
                    },
                ]}
            />

            <Button
                disabled={isButtonDisabled}
                loading={loading}
                buttonStyle={{
                    backgroundColor: 'transparent'
                }}
                containerStyle={{marginTop: '15%', alignItems: 'flex-start', marginLeft: '5%'}}
                icon={{name: 'arrow-left', type: 'material-community', color: '#000000', size: 25}}
                titleStyle={{color: '#000000'}}
                onPress={() => navigation.navigate('Login')}
            />
            <ScrollableBg style={{margin: '5%'}}>
                <View style={{marginBottom: 50, alignItems: 'center'}}>
                    <Image source={Logo} style={styles.logo}/>
                </View>
                <Text style={styles.Ptitle}>{t('text5')}</Text>
                <Input
                    label={t('name')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}/>}
                    onChangeText={(text) => {
                        setFirstName(text);
                        validateName(text)
                    }}
                    value={firstName}
                    placeholder={t('name')}
                    placeholderTextColor={"#000000"}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    autoCapitalize={'none'}
                    inputStyle={{color: '#000000', marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={nameErrorMessage}
                />
                <Input
                    label={t('surname')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="user" color={styles.colorIcon.color}/>}
                    onChangeText={(text) => {
                        setLastName(text);
                        validateLastName(text)
                    }}
                    value={lastName}
                    placeholder={t('surname')}
                    autoCapitalize={'none'}
                    placeholderTextColor={"#000000"}
                    inputStyle={{color: '#000000', marginLeft: 10}}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    errorStyle={{color: 'red'}}
                    errorMessage={lastNameErrorMessage}
                />
                <Input
                    label={t('id')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon}/>}
                    onChangeText={(text) => {
                        setDni(text);
                        validateDNI(text);
                    }}
                    value={dni}
                    placeholder={t('id')}
                    autoCapitalize={'none'}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    placeholderTextColor={"#000000"}
                    inputStyle={{color: '#000000', marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={DNIErrorMessage}
                />
                <Input
                    label="Mail"
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="envelope" color={styles.colorIcon.color}/>}
                    onChangeText={(text) => {
                        setEmail(text);
                        validateEmail(text)
                    }}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    placeholderTextColor={"#000000"}
                    inputStyle={{color: '#000000', marginLeft: 10}}
                    errorStyle={{color: 'red'}}
                    errorMessage={mailErrorMessage}
                />
                <Input
                    label={t('password')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color}/>}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder={t('password')}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    autoCapitalize={'none'}
                    inputStyle={{color: '#000000', marginLeft: 10}}
                    placeholderTextColor={"#000000"}
                />
                <Input
                    label={t('confirmp')}
                    labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                    leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color}/>}
                    onChangeText={(text1) => {
                        setConfirmedPassword(text1);
                        validatePassword(text1);
                    }}
                    value={confirmed_password}
                    secureTextEntry={true}
                    placeholder={t('password')}
                    autoCapitalize={'none'}
                    inputStyle={{color: '#000000', marginLeft: 10}}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                    placeholderTextColor={"#000000"}
                    errorStyle={{color: 'red'}}
                    errorMessage={passwordErrorMessage}
                />
                <View style={{alignItems: 'center'}}>
                    <Button
                        title={t('register')}
                        disabled={isButtonDisabled}
                        loading={loading}
                        buttonStyle={{
                            backgroundColor: '#ecb761',
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
                        titleStyle={{color: '#fff'}}
                        onPress={() => signUpWithEmail()}
                    />
                </View>
            </ScrollableBg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 20,
        marginRight: 20
    },
    buttonSignInContainer: {
        width: '50%',
        justifyContent: 'center',
    },
    buttonSignIn: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        justifyContent: 'center',
    },
    colorIcon: {
        color: '#000000'
    },
    colorLable: {
        color: '#000000',
    },
    icon: {
        width: 24,
        height: 24,
    }, registerW: {
        backgroundColor: '#ffffff',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    Ptitle: {
        color: '#000000',
        textAlign: 'center',
        marginBottom: 80,
        marginTop: 0,
        fontSize: 20,
        fontWeight: 'bold'
    },
    logo: {
        height: 50,
        width: 50,
        marginBottom: 0
    }, bubble: {
        position: 'absolute',
    },
    input: {
        backgroundColor: '#ffffff',
        borderBottomWidth:2,
        borderWidth: 2,
        borderRadius: 15
    },

});

export default Register;


