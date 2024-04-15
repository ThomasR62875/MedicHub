import React, {useState} from 'react';
import {View, Text, Button, Alert, StyleSheet} from 'react-native';
import {supabase} from "../lib/supabase";
import {Input} from "react-native-elements";
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
                .insert({email: email, name: name, profession: profession, phone: phone, user: session?.user.id});

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
        <View style={styles.container}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Add Doctor Screen</Text>
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Name"
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    placeholder="Name"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input
                    label="Profession"
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    onChangeText={(text) => setProfession(text)}
                    value={profession}
                    placeholder="Profession"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Phone"
                    leftIcon={{ type: 'font-awesome', name: 'phone' }}
                    onChangeText={(text) => setPhone(text)}
                    value={phone}
                    placeholder="Phone"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Input
                    label="Email"
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize={'none'}
                />
            </View>
            <View style={styles.verticallySpaced}>
                <Button title="Add" disabled={loading} onPress={() => addDoctor({name, profession, phone, email})} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 5,
    },
    horizontallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
    },

});


