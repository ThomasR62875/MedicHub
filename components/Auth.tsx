import React, { useState } from 'react'
import {Alert, StyleSheet, View, Dimensions, AppState} from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from 'react-native-elements'
import { useNavigation, ParamListBase } from '@react-navigation/native'; // Importa useNavigation desde @react-navigation/native
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const windowHeight = Dimensions.get('window').height;

AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export default function Auth() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>(); // Utiliza useNavigation para obtener el objeto de navegación

    async function signInWithEmail() {
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) Alert.alert(error.message)
        setLoading(false)
    }

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, { height: windowHeight * 0.08 }]}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                />
            </View>
            <View style={[styles.inputContainer, { height: windowHeight * 0.08 }]}>
                <Input
                    label="Password"
                    leftIcon={{ type: 'font-awesome', name: 'lock' }}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                    placeholder="Password"
                    autoCapitalize={'none'}
                    inputContainerStyle={[{paddingLeft: 10}, styles.input]}
                />
            </View>
            <View style={[styles.buttonContainer, { height: windowHeight * 0.08 }]}>
                <Button title="Sign in" disabled={loading} onPress={() => signInWithEmail()} buttonStyle={[styles.button, { backgroundColor: '#3EB77F' }]} />
            </View>
            <View style={[styles.buttonContainer, { height: windowHeight * 0.08 }]}>
                <Button title="Register" disabled={loading} onPress={() => navigation.navigate('Register')} buttonStyle={[styles.button, { backgroundColor: '#3EB77F' }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#B5DCCA',
        borderRadius: 10,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#B5DCCA',
        borderRadius: 10,
    },
});