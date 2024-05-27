import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Appointment} from "../screens/Appointments";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"

interface AppointmentButtonProps {
    onPress: any;
    styleExterior: any;
    date : Date;
    turno: Appointment;
}

const AppointmentButton: React.FC<AppointmentButtonProps> = ( { onPress, turno, date }) => {
    const navigation = useNavigation();
    const otraDate = new Date(date);
    const {t} = useTranslation();

    return (
        <TouchableOpacity style={cardStyle.container} onPress={onPress}>
            <View>
                <View style={cardStyle.infoRow}>
                    <Text>{turno.description}</Text>
                </View>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('user')}:</Text>
                    <Text style={cardStyle.value}>{turno.user_name}</Text>
                </View>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('date')}:</Text>
                    <Text style={cardStyle.value}>{otraDate.getDate()}/{otraDate.getMonth()+1}/{otraDate.getFullYear()}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};


export default AppointmentButton;
