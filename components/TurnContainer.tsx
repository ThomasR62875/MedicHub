import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useTranslation} from "react-i18next";
import {Appointment} from "../lib/types";
import {styles} from "../assets/styles";

interface turnoContainerProps {
    onPress?: any;
    styleExterior: any;
    date: Date;
    turno: Appointment;
}

const turnoContainer: React.FC<turnoContainerProps> = ({styleExterior, turno, date, ...props}) => {
    const otraDate = new Date(date);
    const {t} = useTranslation();

    return (
        <TouchableOpacity style={[styleExterior, {flexDirection: 'row', height: '50%'}]} {...props}>
            <Text
                style={[styles.text, {padding: 15}]}>{otraDate.getHours()}:{otraDate.getMinutes() > 10 ? otraDate.getMinutes() : '0' + otraDate.getMinutes()}</Text>
            <View style={{padding: 10}}>
                <View style={[styles.infoRow,{paddingHorizontal: 10, paddingVertical: 2}]}>
                    <Text style={{textAlign: 'center'}}>{turno.description}</Text>
                </View>
                <View style={[styles.infoRow,{paddingHorizontal: 10, paddingVertical: 2}]}>
                    <Text style={{color: '#A8A8A8', fontSize: 12}}>{turno.user_name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default turnoContainer;
