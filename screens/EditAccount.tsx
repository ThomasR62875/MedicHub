import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {View, Alert, StyleSheet} from 'react-native'
import {Button, Icon, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";



type EditAccountProps = NativeStackScreenProps<RootStackParamList, 'EditAccount'>;


const EditAccount:React.FC<EditAccountProps> = ({navigation, route }) =>{
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [avatar_url, setAvatarUrl] = useState('')
    const [dni, setDni] = useState(0)
    const {t} = useTranslation();

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error(t('warn7'))

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
            if (!session?.user) throw new Error(t('warn7'))

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
            Alert.alert(t('text6'), '',
                [{text: 'Ok', onPress: () => navigation.navigate({name: 'Home', params: {session: session}})},]
            );
        }
    }

    return(
        <View style={styles.container} >
            <View style={styles.window}>
                <Icon name='person-circle-outline' iconStyle={{color: '#12230f', marginBottom: '10%'}} type='ionicon' size={90}/>
                {/* aca iria una carga de archivo/imagen q tdv no sabemos hacer todo*/}
                    <Input label={t('name')} value={first_name} onChangeText={(text) => setFirstName(text)}/>
                    <Input label={t('surname')} value={last_name} onChangeText={(text) => setLastName(text)}/>
                <Button
                    title={t('savec')}
                    loading={loading}
                    buttonStyle={{
                        backgroundColor: '#2E5829',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50
                    }}
                    containerStyle={{
                        width: 200,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        marginTop: 40,
                        alignContent: 'center'
                    }}
                    titleStyle={{ color: '#eef9ed' }}
                    onPress={() => updateProfile({first_name, last_name, dni, avatar_url})}
                />
            </View>
        </View>
    )
}

export default EditAccount

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        alignContent: 'center'
    },
    window: {
        alignItems: 'center',
        marginTop: '20%',
        marginLeft: '5%',
        marginRight: '5%'
    }
})