import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import { Session } from '@supabase/supabase-js'
import {NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddDoctor from "../components/AddDoctor";

const Stack = createNativeStackNavigator();

interface Doctor {
    name: string;
    profession: string;
    phone: string;
    email: string;
}

interface Props {
    session: Session;
}

const Doctors: ({session}: { session: any }) => void = ({ session }) => {
    const [loading, setLoading] = useState(true)
    let doctors: Doctor[] = [];

    useEffect(() => {
        if (session) getDoctors()


    }, [session])

    async function getDoctors() {
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error, status} = await supabase
                .from('doctor')
                .select(`id, email, name, profession, phone`)
                .eq('user', session?.user.id)
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                data.forEach(doctor => {
                    doctors.push({
                        name: doctor.name,
                        profession: doctor.profession,
                        phone: doctor.phone,
                        email: doctor.email
                    })
                });
            }

        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }

        const renderDoctors = () => {
            const doctorInputs: React.JSX.Element[] = [];

            doctors.forEach((doctor, index) => {
                const doctorInput = (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <Input
                            label="Name"
                            value={doctor.name}
                            disabled={true}
                        />
                        <Input
                            label="Profession"
                            value={doctor.profession}
                            disabled={true}
                        />
                        <Input
                            label="Phone"
                            value={doctor.phone}
                            disabled={true}
                        />
                        <Input
                            label="Email"
                            value={doctor.email}
                            disabled={true}
                        />
                    </View>
                );
                doctorInputs.push(doctorInput);
            });

            return doctorInputs;
        };


        return (
            <View style={styles.container}>
                <View>
                    {renderDoctors()}
                </View>
                <NavigationContainer>
                    <Stack.Navigator>
                        {!session ? (
                            <>

                            </>
                        ) : (
                            <>
                                <Stack.Screen name="AddDoctor">
                                    {(props) => <AddDoctor {...props} session={session}/>}
                                </Stack.Screen>
                            </>
                        )}
                    </Stack.Navigator>
                </NavigationContainer>
            </View>
        );
    }

    const styles = StyleSheet.create({
        container: {
            marginTop: 40,
            padding: 12,
        },
        verticallySpaced: {
            paddingTop: 4,
            paddingBottom: 4,
            alignSelf: 'stretch',
        },
        mt20: {
            marginTop: 20,
        },
    })
}

export default Doctors;