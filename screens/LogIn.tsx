import React, {useEffect, useState} from "react";
import {
    Alert,
    Image,
    View,
    Dimensions,
    AppState,
    Text,
} from 'react-native'
import {supabase} from '../lib/supabase'
import {Button, Input} from 'react-native-elements'
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import StandardGreenButton from "../components/StandardGreenButton";
import {RootStackParamList} from "../App";

// @ts-ignore
import Logo from '../assets/icon_black.png'

import {useTranslation} from "react-i18next";
import LanguageButton from "../components/LanguageButton";
import ScrollableBg from "../components/ScrollableBg";
import {styles} from "../assets/styles";


const windowHeight = Dimensions.get('window').height;

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

type LogInProps = NativeStackScreenProps<RootStackParamList, 'Login'>;


const LogIn: React.FC<LogInProps> = ({navigation}) => {
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
        } else {
        }
    }, [email, password]);


    const validateInput = (value: string) => {
        if (value.trim() === '' || !value.includes("@") || !(value.includes(".edu") || value.includes(".com") || value.includes(".ar"))) {
            setErrorMessage(t('warning1'));
        } else {
            setErrorMessage('');
        }
    };

    async function signInWithEmail() {
        setLoading(true)
        const {error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(t('warning2'))
        setLoading(false)
    }

    return (
        <View style={{flex: 1, backgroundColor: '#fff', marginBottom: 0}}>
            {/* Burbuja 1 */}
            <View
                style={[styles.bubble,
                    {
                        width: 250,
                        height: 250,
                        borderRadius: 125,
                        left: 200,
                        top: -50,
                        backgroundColor: 'rgba(139,134,190,0.2)',
                    },]}/>
            {/* Burbuja 2 */}
            <View
                style={[styles.bubble,
                    {
                        width: 400,
                        height: 400,
                        borderRadius: 200,
                        left: -60,
                        top: -200,
                        backgroundColor: 'rgba(139,134,190,0.2)',
                    },]}/>
            <ScrollableBg>
                <View style={{padding: 16}}>
                    <View style={{paddingTop: 40, paddingLeft: 20}}>
                        <LanguageButton/>
                    </View>
                    <View style={styles.window}>
                        <Image source={Logo} style={styles.logo}/>
                        <Text style={{
                            textAlign: 'center',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: 20
                        }}>MedicHub</Text>
                    </View>
                    <Input
                        label={t('email')}
                        labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                        leftIcon={{type: 'font-awesome', name: 'envelope', color: '#000000', size: 20}}
                        onChangeText={(text) => {
                            setEmail(text);
                            validateInput(text)
                        }}
                        value={email}
                        inputStyle={{marginLeft: 12, color: '#000000',fontSize:14}}
                        placeholder={t('email')}
                        placeholderTextColor={'#807d7d'}
                        autoCapitalize={'none'}
                        inputContainerStyle={[{paddingLeft: 20}, styles.input]}
                        errorStyle={{color: 'red'}}
                        errorMessage={errorMessage}
                    />

                    <Input
                        label={t('password')}
                        labelStyle={{color: '#000000', paddingBottom: 10, paddingLeft: 5}}
                        leftIcon={{type: 'font-awesome', name: 'lock', color: '#000000', size: 20, }}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                        placeholder={t('password')}
                        placeholderTextColor={'#807d7d'}
                        autoCapitalize={'none'}
                        inputContainerStyle={[{paddingLeft: 20}, styles.input]}
                        inputStyle={{marginLeft: 12, color: '#000000',fontSize:14}}
                    />
                    <View style={[styles.logInContainer]}>
                        <Button
                            title={t('logIn')}
                            loading={loading}
                            buttonStyle={{
                                backgroundColor: '#86abba',
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
                            titleStyle={{color: '#ffffff', fontWeight: 'semibold'}}
                            onPress={() => signInWithEmail()}
                        />
                    </View>
                    <View style={[styles.buttonRegisterContainer, {marginTop: 80, height: windowHeight * 0.08}]}>
                        <Text style={{color: '#000000', textAlign: 'center', fontSize: 18}}>{t('text1')}</Text>
                        <Button title={t('register')}
                                onPress={() => navigation.navigate('Register')}
                                buttonStyle={[styles.buttonRegister]}
                                titleStyle={{color: '#000000', textDecorationLine: 'underline'}}
                        />
                    </View>
                </View>
                <View style={{padding: 100}}/>
            </ScrollableBg>
        </View>
    );
};


export default LogIn;
