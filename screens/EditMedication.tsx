import React, { useState, useEffect } from 'react'
import {addDoctor, updateMedication} from '../lib/supabase'
import {View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {Button, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

type EditMedicationProps = NativeStackScreenProps<RootStackParamList, 'EditMedication'>;

const EditMedication:React.FC<EditMedicationProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [prescription, setPrescription] = useState('');

    const [nameErrorMessage, setNameErrorMessage] = useState('')
    const [prescriptionErrorMessage, setPrescriptionErrorMessage] = useState('');

    useEffect(() => {
        if (
            name.trim() !== '' &&
            prescription.trim() !== '' &&
            nameErrorMessage === '' &&
            prescriptionErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, prescription]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);


    useEffect(() => {
        if (session) getMed()
    }, [session])

    async function getMed() {
        setId(route.params.medication.id)
        setName(route.params.medication.name);
        setPrescription(route.params.medication.prescription);
    }

    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage('Debe ingresar el nombre del medicamento.');
        } else {
            setNameErrorMessage('');
        }
    };
    const validatePrescription = (value: string) => {
        if (value.trim() === '') {
            setPrescriptionErrorMessage('Debe ingresar la prescripción.');
        } else {
            setPrescriptionErrorMessage('');
        }
    };

    return(
        <View style={styles.container} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.window}>
                    <Input
                        label="Nombre"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            validateName(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={nameErrorMessage}/>
                    <Input
                        label="Prescripción"
                        value={prescription}
                        onChangeText={(text) => {
                            setPrescription(text);
                            validatePrescription(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={prescriptionErrorMessage}
                    />
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
                        disabled={isButtonDisabled}
                        onPress={() => updateMedication( {
                            id: id,
                            name: name,
                            prescription: prescription
                        } )}
                    />
                </View>
            </TouchableWithoutFeedback>
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