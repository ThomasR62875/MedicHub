import React, {useEffect, useState} from "react";
import {
    Alert,
    Image,
    StyleSheet,
    View,
    Dimensions,
    AppState,
    Text,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements'
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import StandardGreenButton from "../components/StandardGreenButton";
import {RootStackParamList} from "../App";
// @ts-ignore
import Logo from '../assets/icon.png'
import {useTranslation} from "react-i18next";
import LanguageButton from "../components/LanguageButton";

const windowHeight = Dimensions.get('window').height;

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

type LogInProps = NativeStackScreenProps<RootStackParamList, 'Login'>;


const LogIn: React.FC<LogInProps> = ({navigation, route})=> {
    const {session} = route.params;
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const {t} = useTranslation();

    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        if (
            email.trim() !== '' &&
            password.trim() !== '' &&
            errorMessage === ''

        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [email, password]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const validateInput = (value: string) => {
        if (value.trim() === '' || !value.includes("@") || !(value.includes(".edu") || value.includes(".com") || value.includes(".ar"))) {
            setErrorMessage(t('warning1'));
        } else {
            setErrorMessage('');
        }
    };

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(t('warning2'))
        setLoading(false)
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{marginLeft: "60%", marginTop: "5%", alignSelf: 'center'}}>
                    <LanguageButton/>
                </View>
                <View style={styles.window}>
                    <Image source={Logo} style={styles.logo} />
                    <Text style={{textAlign: 'center', color: '#2E5829', fontWeight: 'bold', fontSize: 20}}>MedicHub</Text>
                </View>
                <View style={[styles.inputContainer, { height: windowHeight * 0.08 }]}>
                    <Input
                        label="Mail"
                        labelStyle={{color: '#2E5829'}}
                        leftIcon={{ type: 'font-awesome', name: 'envelope', color: '#2E5829'}}
                        onChangeText={(text) => {setEmail(text); validateInput(text)}}
                        value={email}
                        inputStyle={{marginLeft: 10, color:'#407738'}}
                        placeholder='email@address.com'
                        placeholderTextColor={'#407738'}
                        autoCapitalize={'none'}
                        inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                        errorStyle={{ color: 'red' }}
                        errorMessage={errorMessage}
                    />
                </View>
                <View style={[styles.inputContainer, {height: windowHeight * 0.08 }]}>
                    <Input
                        label={t('password')}
                        labelStyle={ {color: '#2E5829FF'}}
                        leftIcon={{ type: 'font-awesome', name: 'lock', color: '#2E5829FF' }}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder={t('password')}
                        placeholderTextColor={'#407738'}
                        autoCapitalize={'none'}
                        inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                        inputStyle={{marginLeft: 10, color:'#407738'}}
                    />
                </View>
                <Button
                    title={t('logIn')}
                    disabled={isButtonDisabled}
                    loading={loading}
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
                    }}
                    titleStyle={{ color: '#eef9ed' }}
                    onPress={() => signInWithEmail()}
                />
                <View style={[styles.buttonRegisterContainer, { marginTop: 80, height: windowHeight * 0.08 }]}>
                    <Text style={{color:'#2E5829', textAlign: 'center', fontSize: 18}}>{t('text1')}</Text>
                    <Button title={t('register')}
                            onPress={() => navigation.navigate('Register')}
                            buttonStyle={[styles.buttonRegister]}
                            titleStyle={{color: '#2E5829', textDecorationLine: 'underline'}}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default LogIn;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e9f4e9',
        paddingHorizontal: 20,
        height: '100%'
    },
    inputContainer: {
        width: '100%',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#e9f4e9',
        borderRadius: 10,
    },
    buttonSignInContainer: {
        width: '50%',
    },
    buttonRegisterContainer: {
        width: '100%',
    },
    buttonRegister: {
        backgroundColor: '#e9f4e9',
        width: 'auto',
    },
    logo:{
        color: '#407738',
        width: 125,
        height: 125
    },
    iconContainer: {
        textAlign: "center",
    }, activityIndicator: {
        position: 'absolute',
        right: 16,},
    window: {
        marginBottom: 50,
        alignItems: 'center',
        marginTop: 30,
    }


});