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
import {Button, Input} from "react-native-elements";
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import RNPickerSelect from 'react-native-picker-select';
import {DependentUser} from "./DependentUsers";

type AddDoctorProps = NativeStackScreenProps<RootStackParamList, 'AddDoctor'>

type Specialty = {
    name: string;
};

const AddDoctor: React.FC<AddDoctorProps> = ({navigation, route}) => {
    const {session} = route.params;
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


    useEffect(() => {
        if (session) {
            const fetchUserId = async () => {
                try {
                    const {data, error} = await supabase.rpc("get_independent_user_id", {})
                    if (data) {
                        setSessionUserId(data);
                    }
                    if (error) {
                        console.error('Error inserting UserId data:', error.message);
                    } else {
                        console.log('UserId data inserted successfully');
                    }

                } catch (error) {
                    console.error('Error fetching UserId data:');
                }
            };
            fetchUserId();

        }
    }, [session]); // Dependencia de sesión para ejecutar solo cuando la sesión cambie

    useEffect(() => {
        if (session_user_id) {
            getAllUsers();
        }
    }, [session_user_id]);

    useEffect(() => {
        if (session) getSpecialties()
    }, [session])
    async function getSpecialties(){
        try {
            const {data, error} = await supabase.rpc('get_specialties');
            setSpecialties(data);
            if (error) {
                console.error('Error inserting specialty data:', error.message);
            } else {
                console.log('Specialty data inserted successfully');
            }
        } catch (error) {
            console.error('Error fetching specialities:');
        }

    }

    async function getAllUsers(){
        try {
            const { data, error } = await supabase.rpc('get_all_users', { user_id: session_user_id });
            setAllUsers(data);
            if (error) {
                console.error('Error inserting users data:', error.message);
            } else {
                console.log('Users data inserted successfully');
            }
        } catch (error) {
            console.error('Error fetching users data:');
        }

    }

    async function addDoctor({
        name,
        specialty,
        phone,
        email,
        addresses,
        user_id
    }: {
        name: string
        specialty: string
        phone: string
        email: string
        addresses: [string]
        user_id: string
    }) {
        try {
            const { error } = await supabase.rpc("add_doctor", {name_input: name, specialty_input: specialty,phone_input: phone, email_input: email, addresses_input: addresses, user_id_input:user_id})
            if (error) {
                console.error('Error inserting data:', error.message);
            } else {
                console.log('Data inserted successfully');
            }
        } catch (error) {
            // @ts-ignore
            console.error('An error occurred:', error.message);
        }finally{
            Alert.alert("El Médico ya está agregado")
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView>
                <View>
                    <View style={styles.verticallySpaced}>
                        <Input
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            onChangeText={(text) => setName(text)}
                            value={name}
                            placeholder="Nombre"
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            placeholder={{ label: 'Especialidad', value: null }}
                            items={specialties ? specialties.map(s => ({ label: s.name, value: s.name })) : []}
                            onValueChange={(value) => setSpecialty(value)}
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
                            onValueChange={(value) => setUserId(value)}
                            style={{ ...pickerSelectStyles }}
                            value={user_id}
                        />
                    </View>
                    <View style={styles.verticallySpaced}>
                        <StandardGreenButton
                            title="Agregar"
                            onPress={() => addDoctor({name, specialty, phone, email, addresses, user_id})}
                            disabled={loading}
                        />
                    </View>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default AddDoctor;


const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 12,
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



