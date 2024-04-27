import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {supabase} from "../lib/supabase";
import {Button, Input} from "react-native-elements";
import {Session} from "@supabase/supabase-js";
import StandardGreenButton from "../components/StandardGreenButton";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import Doctors from "../screens/Doctors";

type AddDoctorProps = NativeStackScreenProps<RootStackParamList, 'AddDoctor'>

const AddDoctor: React.FC<AddDoctorProps> = ({navigation, route}) => {
    const {session} = route.params;
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [specialty, setSpecialty] = useState('')
    const [phone, setPhone] = useState('')
    const [addresses, setAddresses] = useState<[string]>([''])

    async function addDoctor({
        name,
        specialty,
        phone,
        email,
        addresses,
    }: {
        name: string
        specialty: string
        phone: string
        email: string
        addresses: [string]
    }) {
        try {
            const { error } = await supabase.rpc("add_doctor", {name_input: name, specialty_input: specialty,phone_input: phone, email_input: email, addresses_input: addresses})
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Add Doctor Screen</Text>
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Nombre"
                        leftIcon={{ type: 'font-awesome', name: 'user' }}
                        onChangeText={(text) => setName(text)}
                        value={name}
                        placeholder="Nombre"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={[styles.verticallySpaced, styles.mt20]}>
                    <Input
                        label="Especialidad"
                        leftIcon={{ type: 'font-awesome', name: 'user-md' }}
                        onChangeText={(text) => setSpecialty(text)}
                        value={specialty}
                        placeholder="Especialidad"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Teléfono"
                        leftIcon={{ type: 'font-awesome', name: 'phone' }}
                        onChangeText={(text) => setPhone(text)}
                        value={phone}
                        placeholder="Teléfono"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Mail"
                        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        placeholder="email@address.com"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <Input
                        label="Address"
                        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                        onChangeText={(text) => setAddresses([text])}
                        value={addresses[0] || ''} // Access the first element of addresses
                        placeholder="Address"
                        autoCapitalize={'none'}
                    />
                </View>
                <View style={styles.verticallySpaced}>
                    <StandardGreenButton
                        title="Agregar"
                        onPress={() => addDoctor({name, specialty, phone, email, addresses})}
                        disabled={loading}
                    />

                </View>
            </View>
        </TouchableWithoutFeedback>
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
    }

});


