import React, {useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {supabase} from "../lib/supabase";
import {Input} from "react-native-elements";

const Register: React.FC = ({ navigation }: any) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dni, setDni] = useState('')

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

        if (error) Alert.alert(error.message)
        if (!session) Alert.alert('Please check your inbox for email verification!')
        setLoading(false)
    }
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Register Screen</Text>
            </View>
            <View style={styles.horizontallySpaced}>
                <View style={styles.nameContainer}>
                    <Input
                        label="First Name"
                        leftIcon={{ type: 'font-awesome', name: 'user' }}
                        onChangeText={(text) => setFirstName(text)}
                        value={firstName}
                        placeholder="First Name"
                        autoCapitalize={'none'}
                        containerStyle={styles.inputContainer} // Add inputContainer style
                    />
                    <Input
                        label="Last Name"
                        leftIcon={{ type: 'font-awesome', name: 'user' }}
                        onChangeText={(text) => setLastName(text)}
                        value={lastName}
                        placeholder="Last Name"
                        autoCapitalize={'none'}
                        containerStyle={styles.inputContainer} // Add inputContainer style
                    />
                </View>
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="DNI"
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onChangeText={(text) => setDni(text)}
                    value={dni}
                    placeholder="DNI"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Confirm Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Button title="Register" disabled={loading} onPress={() => signUpWithEmail()} />
            </View>
        </View>
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
    mt20: {
        marginTop: 5,
    },
    horizontallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
    },
    nameContainer: {
        flexDirection: 'row', // Display first name and last name in a row
    },
    inputContainer: {
        width: '50%', // Make each input field take up 50% of the container width
    },
});

export default Register;


