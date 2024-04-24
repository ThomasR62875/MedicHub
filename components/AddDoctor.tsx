import React, {useState} from 'react';
import {View, Text, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {supabase} from "../lib/supabase";
import {Button, Input} from "react-native-elements";
import {Session} from "@supabase/supabase-js";

export default function AddDoctor({ session }: { session: Session }) {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [profession, setProfession] = useState('')
    const [phone, setPhone] = useState('')


    async function addDoctor({
        name,
        profession,
        phone,
        email,
    }: {
        name: string
        profession: string
        phone: string
        email: string
    }) {
        try {
            const { error } = await supabase
                .from('doctor')
                .insert({email: email, name: name, profession: profession, phone: phone, users:[session?.user.id]});

            if (error) {
                console.error('Error inserting data:', error.message);
            } else {
                console.log('Data inserted successfully');
            }
        } catch (error) {
            // @ts-ignore
            console.error('An error occurred:', error.message);
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
                        onChangeText={(text) => setProfession(text)}
                        value={profession}
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
                    <Button title="Agregar"
                            disabled={loading}
                            onPress={() => addDoctor({name, profession, phone, email})}
                            buttonStyle={[styles.buttonAdd, { backgroundColor: '#3EB77F' }]}
                    />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

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
    buttonAdd: {
        width: '40%',
        alignSelf: 'center',
        borderRadius: 10,
    }

});


