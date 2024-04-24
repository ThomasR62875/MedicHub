import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {StyleSheet, View, Alert, Text} from 'react-native'
import {Button, Input, Icon} from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";


type AccountScreenProps = NativeStackScreenProps<RootStackParamList, 'Account'>;


const Account: React.FC<AccountScreenProps> = ({ navigation, route }) =>{
    const {session} = route.params;
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [dni, setDni] = useState(0)
    const [email, setEmail] = useState('')
    const [avatar_url, setAvatarUrl] = useState('')


    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            if (!session?.user) throw new Error('No user on the session!')
            const { data, error, status } = await supabase
                .from('independent_user')
                .select(`first_name, last_name, dni, email, avatar_url`)
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) {
                throw error
            }
            if (data) {
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setDni(data.dni)
                setEmail(data.email)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    return (
        <View>
            <View style={styles.iconContainer}>
                <Icon name='build-outline' type='ionicon' size={35} onPress={() => navigation.navigate('EditAccount', {session: session})} />
            </View>
            <View style={styles.grid}>
                <View>
                    <Text style={styles.text2}>Aca va la imagen</Text>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text1}>{first_name}</Text>
                    <Text style={styles.text1}>{last_name}</Text>
                </View>
            </View>
            <View style={styles.spaced}>
                <Text style={styles.title}>Mail:</Text>
                <Text style={styles.text2}>{session?.user.email}</Text>
                <Text style={styles.title}>DNI:</Text>
                <Text style={styles.text2}>{dni}</Text>
                <Button title={<Text style={styles.buttonText}>Mis vacunas</Text>}
                        buttonStyle={styles.misCosas}
                        icon={<Icon name="" size={20}/>}
                />
                <Button title={<Text style={styles.buttonText}>Usuarios dependientes</Text>}
                        buttonStyle={styles.misCosas}
                        icon={<Icon name="person" type="ionicon" size={25}/>}
                />
                <View style={{marginTop: 20}}>
                    <Button title="Cerrar sesión"
                            onPress={() => supabase.auth.signOut()}
                            icon={<Icon name="log-in-outline" type="ionicon" size={54} color="white" />}
                            buttonStyle={styles.cerrarSesion}/>
                </View>
            </View>
        </View>

    )
}

export default Account

const styles = StyleSheet.create({
    iconContainer: {
        top: 10,
        left: 305,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B5DCCA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cerrarSesion:{
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#073A29',
        borderRadius: 10,
    },
    spaced: {
        marginTop: 5,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '90%',
    },
    misCosas: {
        width: '80%',
        backgroundColor: '#D6EFD4',
        color: 'black',
        borderRadius: 10,
        marginBottom: 5,
        alignSelf: 'center',
    },
    text1: {
        fontSize: 25,
    },
    text2: {
        fontSize: 25,
        marginLeft: 10,
    },
    title: {
        fontSize: 22,
        textAlign: "left",
        color: '#808080',
        marginTop: 10,
        marginLeft: 10,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 20,
    },
})

