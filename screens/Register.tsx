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
import { Button} from 'react-native-elements'
import {supabase} from "../lib/supabase";
import {Input, Icon} from "react-native-elements";
import StandardGreenButton from "../components/StandardGreenButton";

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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Register Screen</Text>
                </View>
                <View style={styles.verticallySpaced}>
                    <ScrollView>
                    <Input
                        label="Nombre"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setFirstName(text)}
                        value={firstName}
                        placeholder="Nombre"
                        autoCapitalize={'none'}
                    />
                    <Input
                        label="Apellido"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="user" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setLastName(text)}
                        value={lastName}
                        placeholder="Apellido"
                        autoCapitalize={'none'}
                    />
                    <Input
                        label="DNI"
                        labelStyle={styles.colorLable}
                        leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                        onChangeText={(text) => setDni(text)}
                        value={dni}
                        placeholder="DNI"
                        autoCapitalize={'none'}
                    />
                    <Input
                        label="Mail"
                        labelStyle={styles.colorLable}
                        leftIcon={<Icon type= "font-awesome" name="envelope" color={styles.colorIcon.color}/>}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
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
                    />
                </ScrollView>
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} >
                    <View style={[styles.buttonSignInContainer, { height: windowHeight * 0.08, marginTop: 40}]}
                    // Nose porq, pero al modificar el 0.08 no cambia nada, y si lo borras se borra el button xd TODO
                    >
                        <StandardGreenButton title="Ingresar"
                        disabled={loading}
                        onPress={() => signUpWithEmail()}
                        />
                    </View>
                </View>
                </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
    nameContainer: {
        flexDirection: 'row', // Display first name and last name in a row
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
        color: '#454546'
    },
    colorLable: {
        color: '#000000'
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default Register;


