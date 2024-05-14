import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {View, Alert, StyleSheet} from 'react-native'
import {Button, Icon, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import StandardGreenButton from "../components/StandardGreenButton";



type EditMedicationProps = NativeStackScreenProps<RootStackParamList, 'EditMedication'>;


const EditMedication:React.FC<EditMedicationProps> = ({navigation, route }) =>{
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [name, setName] = useState('')
    const [prescription, setPrescription] = useState('');


    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const { data, error } = await supabase.rpc('get_independent_user', { auth_id_input: session?.user.id });

            if (data) {
                setName(data.name)
                setPrescription(data.prescription)

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
        name, prescription
                                 }: {
        name: string
        prescription: string
    }) {
        try {
            setLoading(true)
            const {error} = await supabase.rpc("update_medication", {name_input: name,
                prescription_input: prescription})
            if (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
            Alert.alert('Los datos fueron actualizados', '',
                [{text: 'Ok', onPress: () => navigation.navigate({name: 'Home', params: {session: session}})},]
            );
        }
    }

    return(
        <View style={styles.container} >
            <View style={styles.window}>
                <Input label="Nombre" value={name} onChangeText={(text) => setName(text)}/>
                <Input label="Prescripción" value={prescription} onChangeText={(text) => setPrescription(text)}/>
                <Button
                    title="Guardar cambios"
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
                    onPress={() => updateProfile({name, prescription})}
                />
            </View>
        </View>
    )
}

export default EditMedication

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