import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Text, Alert } from 'react-native';
import {Appointment} from "./Appointments";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

type AddAppointmentProps = NativeStackScreenProps<RootStackParamList, 'SingleAppointment'>


const SingleAppointment: React.FC<AddAppointmentProps> = ({ navigation, route }: any) => {
    // Convert date to desired format
    const originalDate = new Date(route.params.appointment.date);
    const formattedDate = `${originalDate.getDate()}/${originalDate.getMonth() + 1}/${originalDate.getFullYear()}`;
    const formattedTime = `${(originalDate.getHours() + 3) % 24}:${originalDate.getMinutes().toString().padStart(2, '0')}`;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalles del Turno</Text>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Usuario:</Text>
                <Text style={styles.value}>{route.params.appointment.user_name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Fecha:</Text>
                <Text style={styles.value}>{formattedDate}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Hora:</Text>
                <Text style={styles.value}>{formattedTime}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Doctor:</Text>
                <Text style={styles.value}>{route.params.appointment.doctor}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Descripción:</Text>
                <Text style={styles.value}>{route.params.appointment.description}</Text>
            </View>
        </View>
    );
};

export default SingleAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e9f4e9',
    },
    title: {
        alignItems: 'center',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
});
