import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import {Appointment} from "../screens/Appointments";

interface AppointmentButtonProps {
    onPress: any;
    styleExterior: any;
    date : Date;
    turno: Appointment;
}

const AppointmentButton: React.FC<AppointmentButtonProps> = ( { onPress, styleExterior, turno, date }) => {
    const navigation = useNavigation();
    const otraDate = new Date(date);
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styleExterior}>
                <View style={styles.infoRow}>
                    <Text style={{textAlign: 'center'}}>{turno.description}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Usuario:</Text>
                    <Text>{turno.user_name}</Text>
                    <View style={{ width: 30 }} />
                    <Text style={styles.label}>Fecha:</Text>
                    <Text>{otraDate.getDate()}/{otraDate.getMonth()+1}/{otraDate.getFullYear()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        height: 100,
        borderRadius: 28,
        backgroundColor: '#CBE4C9FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
        padding: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
});

export default AppointmentButton;
