import React, { useState, useEffect } from 'react'
import {updateMedication} from '../lib/supabase'
import {View, StyleSheet} from 'react-native'
import {Button, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

type EditMedicationProps = NativeStackScreenProps<RootStackParamList, 'EditMedication'>;

const EditMedication:React.FC<EditMedicationProps> = ({route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [prescription, setPrescription] = useState('');

    useEffect(() => {
        if (session) getMed()
    }, [session])

    async function getMed() {
        setId(route.params.medication.id)
        setName(route.params.medication.name);
        setPrescription(route.params.medication.prescription);
    }

    return(
        <View style={styles.container} >
            <View style={styles.window}>
                <Input label="Nombre" value={name} onChangeText={(text) => setName(text)}/>
                <Input label="Prescripción" value={prescription} onChangeText={(text) => setPrescription(text)}/>
                <Button
                    title="Guardar cambios"
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
                    titleStyle={{ color: '#EEF9ED' }}
                    onPress={() => updateMedication( {
                        id: id,
                        name: name,
                        prescription: prescription
                    } )}
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