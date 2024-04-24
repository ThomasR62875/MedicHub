import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {StyleSheet, View, Alert, Text} from 'react-native'
import {Button, Input} from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";



type EditAccountProps = NativeStackScreenProps<RootStackParamList, 'EditAccount'>;


const EditAccount:React.FC<EditAccountProps> = ({navigation, route }) =>{
    const {session} = route.params;

    const [loading, setLoading] = useState(true)
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
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error, status} = await supabase
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
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
                                     first_name,
                                     last_name,
                                     dni,
                                     email,
                                     avatar_url,
                                 }: {
        first_name: string
        last_name: string
        dni: number
        email: string
        avatar_url: string
    }) {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No hay ningun usuario conectado!')

            const updates = {
                id: session?.user.id,
                first_name,
                last_name,
                dni,
                email,
                avatar_url,
                updated_at: new Date(),
            }

            const {error} = await supabase.from('independent_user').upsert(updates)

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
        <View>
            <View style={styles.col}>
                <View>
                    <Input label="Nombre" value = {first_name} onChangeText={(text) => setFirstName(text)} />
                </View>
                <View>
                    <Input label="Apellido" value={last_name} onChangeText={(text) => setLastName(text)} />
                </View>
            </View>
        </View>
    )
}

export default EditAccount

const styles = StyleSheet.create({
    col: {
    flex: 1,
        flexDirection: 'column',
    },

})

// export default EditAccount;







/*
<View style={styles.verticallySpaced}>
                <Button
                    title={loading ? 'Cargando ...' : 'Actualizar'}
                    onPress={() => updateProfile({ first_name,   last_name,  dni,  email,  avatar_url })}
                    disabled={loading}
                />
            </View>

            <Input label="Avatar" value={avatar_url} onChangeText={(text) => setAvatarUrl(text)} />
                </View>
                <View style={styles.col}>
                    <View>
                        <Input label="Nombre" value = {first_name} onChangeText={(text) => setFirstName(text)} />
                    </View>
                    <View>
                        <Input label="Apellido" value={last_name} onChangeText={(text) => setLastName(text)} />
                    </View>
                </View>
            </View>
            <View>
                <Input label="DNI" value={dni ? dni.toString() : ''}
                       onChangeText={(text) => {
                           const parsedDNI = parseInt(text, 10);
                           if (!isNaN(parsedDNI)) {
                               setDni(parsedDNI);
                           }
                       }}
                       keyboardType="numeric"/>
                <Input label="Mail" value={email} onChangeText={(text) => setEmail(text)} />

                <View >
                    <Button title="Cancelar" onPress={() => flag=false}/>
                    <Button title="Guardar" onPress={() => updateProfile({ first_name,   last_name,  dni,  email,  avatar_url })}/>
                </View>

 */