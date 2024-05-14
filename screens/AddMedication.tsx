import React, {useEffect, useState} from 'react';
import {
    View,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import {supabase} from "../lib/supabase";
import {Input} from "react-native-elements";
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";


type AddMedicationProps = NativeStackScreenProps<RootStackParamList, 'AddMedication'>



const AddMedication: React.FC<AddMedicationProps> = ({navigation, route}) => {
    const {session} = route.params;
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

    async function AddMedication({
        name,
        prescription
    }: {
        name: string
        prescription: string
    }) {
        try {
            const { error } = await supabase.rpc("add_medication", {name_input: name, prescription_input: prescription})
            if (error) {
                console.error('Error inserting data:', error.message);
            } else {
                console.log('Data inserted successfully');
            }
        } catch (error) {
            // @ts-ignore
            console.error('An error occurred:', error.message);
        }finally{
            Alert.alert(
                'El medicamento fue agregado',
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Medication', { session: session }) }
                ]
            );

        }

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

    return (
        <View style={styles.containerTotal}>
        <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView>
                <View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            onChangeText={(text) => {
                                setName(text);
                                validateName(text)
                            }}
                            value={name}
                            placeholder="Nombre"
                            autoCapitalize={'none'}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nameErrorMessage}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={(text) => {
                                setPrescription(text);
                                validatePrescription(text)
                            }}
                            value={prescription}
                            placeholder="Prescripción"
                            autoCapitalize={'none'}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nameErrorMessage}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <StandardGreenButton
                            title="Agregar"
                            disabled={isButtonDisabled}
                            onPress={() => AddMedication({name, prescription})}
                        />
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </View>
    );
};

export default AddMedication;


const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 12,
    },
    containerTotal:{
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    verticallySpaced: {
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 5,
    },
    horizontallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
    },
    textInput: {
        height: 40,
        borderColor: '#000000',
        borderBottomWidth: 1,
        marginBottom: 36,
        fontSize: 20,
    },
    pickerStyle: {
        marginBottom: 20,
    }

});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});