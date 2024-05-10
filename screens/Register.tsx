import React, {useEffect, useState} from 'react';
import {
    View, ScrollView,
    Text,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Dimensions, KeyboardAvoidingView, Image
} from 'react-native';
import {supabase} from "../lib/supabase";
import {Input, Icon, Button} from "react-native-elements";
import StandardGreenButton from "../components/StandardGreenButton";
// @ts-ignore
import Logo from '../assets/icon.png'



const windowHeight = Dimensions.get('window').height;

const Register: React.FC = ({ navigation }: any) => {
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
    }, [firstName, lastName, dni, email, password, confirmed_password]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage('Debe ingresar su nombre.');
        } else {
            setNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage('Debe ingresar su apellido.');
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        const containsLetterOrSymbol = /[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-]/.test(value);
        if (containsLetterOrSymbol) {
            setDNIErrorMessage('Debe ingresar su DNI. Ej: 12345678');
        } else {
            setDNIErrorMessage('');
        }
    };
    const validateEmail = (value: string) => {
        if (value.trim() === '' || !value.includes("@") || !(value.includes(".edu") || value.includes(".com") || value.includes(".ar"))) {
            setMailErrorMessage('Dirección de mail inválida. Ej: email@address.com');
        } else {
            setMailErrorMessage('');
        }
    };
    const validatePassword = (value: string) => {
        if (password !== value) {
            setPasswordErrorMessage('La contraseña ingresada es distinta.');
        } else {
            setPasswordErrorMessage('');
        }
    };

    async function signUpWithEmail() {
        setLoading(true)

        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    dni: dni,
                },
            },
        })

        if (!error) Alert.alert('¡Revise su bandeja de entrada para verificar el mail!')
        setLoading(false)
    }

    return (
        <View style={styles.registerW}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <ScrollView>
                <View style={{marginBottom: 50, alignItems: 'center'}}>
                    <Image source={Logo} style={styles.logo} />
                </View>
                <Text style={styles.Ptitle}>Registrate a MedicHub</Text>
                    <Input
                        label="Nombre"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => {
                            setFirstName(text);
                            validateName(text)
                        }}
                        value={firstName}
                        placeholder="Nombre"
                        placeholderTextColor={"#407738"}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={nameErrorMessage}
                    />
                    <Input
                        label="Apellido"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => {
                            setLastName(text);
                            validateLastName(text)
                        }}
                        value={lastName}
                        placeholder="Apellido"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={lastNameErrorMessage}
                    />
                    <Input
                        label="DNI"
                        labelStyle={styles.colorLable}
                        leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                        onChangeText={(text) => {
                            setDni(text);
                            validateDNI(text);
                        }}
                        value={dni}
                        placeholder="DNI"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={DNIErrorMessage}
                    />
                    <Input
                        label="Mail"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="envelope" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => {setEmail(text); validateEmail(text)}}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        errorStyle={{ color: 'red' }}
                        errorMessage={mailErrorMessage}
                    />
                    <Input
                        label="Contraseña"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type="font-awesome" name="lock" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder="Contraseña"
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                    />
                    <Input
                        label="Confirmar contraseña"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type="font-awesome"  name="lock" color={styles.colorIcon.color}/>}
                        onChangeText={(text1) => {
                            setConfirmedPassword(text1);
                            validatePassword(text1);
                        }}
                        value={confirmed_password}
                        secureTextEntry={true}
                        placeholder="Contraseña"
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                        errorStyle={{ color: 'red' }}
                        errorMessage={passwordErrorMessage}
                    />
                    <View style={{alignItems: 'center'}}>
                        <Button
                            title="Registrarse"
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
                                marginBottom:100
                            }}
                            titleStyle={{ color: '#eef9ed' }}
                            onPress={() => signUpWithEmail()}
                        />
                    </View>
                </ScrollView>


                {/*<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >*/}
                {/*    <View style={[styles.buttonSignInContainer, { height: windowHeight * 0.08, marginTop: 40}]}>*/}
                {/*        <StandardGreenButton title="Ingresar"*/}
                {/*        disabled={loading}*/}
                {/*        onPress={() => signUpWithEmail()}*/}
                {/*        />*/}
                {/*    </View>*/}
                {/*</View>*/}
                </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        marginLeft: 20,
        marginRight: 20
    },
    buttonSignInContainer: {
        width: '50%',
        justifyContent: 'center',
    },
    buttonSignIn: {
        backgroundColor: '#B5DCCA',
        borderRadius: 10,
        justifyContent: 'center',
    },
    colorIcon: {
        color: '#2E5829FF'
    },
    colorLable: {
        color: '#2E5829FF',
    },
    icon: {
        width: 24,
        height: 24,
    }, registerW: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    Ptitle: {
        color: '#2E5829FF',
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
    }
});

export default Register;


