import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {StyleSheet, View, Alert, Text} from 'react-native'
import {Button, Icon, Input} from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {setDisabled} from "@expo/metro-runtime/build/error-overlay/Data/LogBoxData";
import StandardGreenButton from "../components/StandardGreenButton";



type EditAccountProps = NativeStackScreenProps<RootStackParamList, 'EditAccount'>;


const EditAccount:React.FC<EditAccountProps> = ({navigation, route }) =>{
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [avatar_url, setAvatarUrl] = useState('')
    const [dni, setDni] = useState(0)

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error } = await supabase.rpc('get_independent_user', { auth_id_input: session?.user.id });

            if (data) {
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setDni(data.dni)
                setAvatarUrl(data.avatar_url)
            }

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
                                     first_name,
                                     last_name,
                                     dni,
                                     avatar_url,
                                 }: {
        first_name: string
        last_name: string
        dni: number
        avatar_url: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No hay ningun usuario conectado!')

            const {error} = await supabase.rpc("update_independent_user", {first_name_input: first_name,
                last_name_input: last_name,
                dni_input: dni,
                avatar_url_input: avatar_url})

            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return(

        <View >
            <Icon name='person-circle-outline' type='ionicon' size={90} onPress={() => navigation.navigate('EditAccount', {session: session})} />
            {/* aca iria una carga de archivo/imagen q tdv no sabemos hacer todo*/}
                <Input label="Nombre" value={first_name} onChangeText={(text) => setFirstName(text)}/>
                <Input label="Apellido" value={last_name} onChangeText={(text) => setLastName(text)}/>

            {/*AGREGAR TAMBIEN LOS CAMPOS QUE SE CONSIDEREN NECESARIOS (EN LA FUNCION DE MOMENTO ESTA AVATAR URL Y DNI TMABN)*/}

                <StandardGreenButton
                    title="Guardar Cambios"
                    onPress={() => updateProfile({first_name, last_name, dni, avatar_url})}
                    disabled={loading}
                />
        </View>
    )
}

export default EditAccount

const styles = StyleSheet.create({
    container: {
        marginTop:10
    },
})
