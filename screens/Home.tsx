import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Icon} from "react-native-elements";
import {Card} from '../components/Card';
import {supabase} from "../lib/supabase";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

type HomeProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home: React.FC<HomeProps> = ({navigation, route}) => {
    const {session} = route.params;
    const [first_name, setFirstName] = useState('')
    const imgDoc = require('../assets/doc.png');
    const imgTurno = require('../assets/calendario.png');
    const imgMed = require('../assets/meds.png');

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            if (!session?.user) throw new Error('No user on the session!')
            const {data, error} = await supabase.rpc('get_independent_user', {auth_id_input: session?.user.id});

            if (data) {
                setFirstName(data.first_name)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    return (
        <View>
            <View style={styles.profileIconContainer} >
                <Icon name='person-circle-outline' type='ionicon' onPress={() => navigation.navigate({name: 'Account', params: {session: session}})} size={35} />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Bienvenido {first_name}</Text>
                <View style={styles.grid}>
                    <View style={styles.col}>
                        <Card title="Turnos" img={imgTurno} onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}/>
                        <View style={{ marginBottom: 30 }} />

                    </View>
                    <View style={styles.col}>
                        <Card title="Médicos" img={imgDoc}  onPress={() => navigation.navigate({name: 'Doctors', params: {session: session}})}/>
                        <View style={{ marginBottom: 30 }} />
                        <Card title="Medicamentos" img={imgMed}  onPress={() => navigation.navigate({name: 'Medication', params: {session: session}})}/>
                    </View>
                    {/*<View style={styles.col}>*/}
                    {/*    <Card title="Agregar usuario" onPress={()=> navigation.navigate('AddDependentUser')}/>*/}
                    {/*</View>*/}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileIconContainer: {
        top: 10,
        left: 315,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B5DCCA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 10,
    },
    text: {
        fontSize: 25,
        marginBottom: 5,
    }
});

export default Home;
