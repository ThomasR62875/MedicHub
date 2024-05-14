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
import {addDoctor, getAllUsers, getSpecialties, getUserId} from "../lib/supabase";
import {Input} from "react-native-elements";
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import RNPickerSelect from 'react-native-picker-select';
import {DependentUser} from "./DependentUsers";

type AddDoctorProps = NativeStackScreenProps<RootStackParamList, 'AddDoctor'>

export type Specialty = {
    name: string;
};

const AddDoctor: React.FC<AddDoctorProps> = ({navigation, route}) => {
    const session = route.params.session;
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [specialties, setSpecialties] = useState<Specialty[] | null>(null);
    const [specialty,setSpecialty]= useState('')
    const [phone, setPhone] = useState('')
    const [addresses, setAddresses] = useState<[string]>([''])
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>(undefined)
    const [session_user_id, setSessionUserId] = useState('')
    const [user_id, setUserId] = useState('')

    const [nameErrorMessage, setNameErrorMessage] = useState('')

    useEffect(() => {
        if (
            name.trim() !== '' &&
            nameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, specialty]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (session){ 
            async function fetchData() {
                // @ts-ignore
                setSpecialties(await getSpecialties())
                setAllUsers(await getAllUsers(await getUserId()))
            }  
            fetchData()
        }
    }, [session])

    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage('Debe ingresar el nombre del médico.');
        } else {
            setNameErrorMessage('');
        }
    };

    const validateSpecialty = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage('Debe seleccionar la especialidad del médico.');
        } else {
            setNameErrorMessage('');
        }
    };

    const validateUser = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage('Debe seleccionar el usuario.');
        } else {
            setNameErrorMessage('');
        }
    };

    const handleAddDoctor = async () => {
        const doctor = {
            name:name, specialty:specialty, phone:phone, email:email, addresses:
            addresses, id:user_id
        };

        const result = await addDoctor(doctor);
        if (result.success) {
            Alert.alert(
                'El Doctor fue agregado',
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Doctors', { session: session }) }
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
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
                                validateName(text);
                            }}
                            value={name}
                            placeholder="Nombre"
                            autoCapitalize={'none'}
                            errorStyle={{ color: 'red' }}
                            errorMessage={nameErrorMessage}
                        />
                    </View>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            placeholder={{ label: 'Especialidad', value: null }}
                            items={specialties ? specialties.map(s => ({ label: s.name, value: s.name })) : []}
                            onValueChange={(value) =>
                                setSpecialty(value)
                            }
                            style={{ ...pickerSelectStyles }}
                            value={specialty}
                        />
                    </View>

                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'phone' }}
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                            placeholder="Teléfono"
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="email@address.com"
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'map-marker' }}
                            onChangeText={(text) => setAddresses([text])}
                            value={addresses[0] || ''}
                            placeholder="Dirección"
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            placeholder={{ label: 'Usuario', value: null }}
                            items={all_users ? all_users.map(u => ({ label: u.first_name, value: u.id})) : []}
                            onValueChange={(value) =>
                                setUserId(value)
                            }
                            style={{ ...pickerSelectStyles }}
                            value={user_id}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <StandardGreenButton
                            title="Agregar"
                            disabled={isButtonDisabled}
                            onPress={handleAddDoctor}
                        />
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
        </View>
    );
};

export default AddDoctor;


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



