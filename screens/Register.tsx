import React, {useState} from 'react';
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

    async function signUpWithEmail() {
        setLoading(true)
        if(confirmed_password != password) {
            setLoading(false);
            throw new Error('Passwords do not match!');
        }

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

        if (error) Alert.alert(error.message)
        else Alert.alert('Please check your inbox for email verification!')
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
                        onChangeText={(text) => setFirstName(text)}
                        value={firstName}
                        placeholder="Nombre"
                        placeholderTextColor={"#407738"}
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                    />
                    <Input
                        label="Apellido"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setLastName(text)}
                        value={lastName}
                        placeholder="Apellido"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}

                    />
                    <Input
                        label="DNI"
                        labelStyle={styles.colorLable}
                        leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                        onChangeText={(text) => setDni(text)}
                        value={dni}
                        placeholder="DNI"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}

                    />
                    <Input
                        label="Mail"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="envelope" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="Email@address.com"
                        autoCapitalize={'none'}
                        placeholderTextColor={"#407738"}
                        inputStyle={{color: '#407738', marginLeft: 10}}
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
                        onChangeText={(text1) => setConfirmedPassword(text1)}
                        value={confirmed_password}
                        secureTextEntry={true}
                        placeholder="Contraseña"
                        autoCapitalize={'none'}
                        inputStyle={{color: '#407738', marginLeft: 10}}
                        placeholderTextColor={"#407738"}
                    />
                    <View style={{alignItems: 'center'}}>
                        <Button
                            title="Registrarse"
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


