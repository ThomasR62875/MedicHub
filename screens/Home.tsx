import React, {useState} from 'react';
import { View, Text, Button, StyleSheet} from 'react-native';
import {Icon } from "react-native-elements";
import {Card} from '../components/Card'


    const Home: React.FC = ({navigation}: any) => {
        return (

            <View style={styles.verticallySpaced}>
                <View style={styles.profileIconContainer} >
                    <Icon name='person-circle-outline' type='ionicon' onPress={() => navigation.navigate('Account')} />
                </View>
                <View style={styles.cardContainer}>
                    <Text>Bienvenido !!</Text>
                    {/*<Card> onPress={() => navigation.navigate('AddAppointment')} </Card>]*/}
                    <Button title="Agregar turno" onPress={() => navigation.navigate('AddAppointment')}/>
                    <Button title="Turnos" onPress={() => navigation.navigate('Appointments')}/>
                    <Button title="Agregar doctor" onPress={() => navigation.navigate('AddDoctor')}/>
                    <Button title="Doctors" onPress={() => navigation.navigate('Doctors')}/>
                </View>
            </View>
        );
    }

const styles = StyleSheet.create({
    profileIconContainer: {
        //position: 'absolute',
        top: 5,
        left: 315,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'lightgrey',
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    verticallySpaced: {
        paddingTop: 2,
        paddingBottom: 2,
        alignSelf: 'stretch',
    },
});

export default Home;
