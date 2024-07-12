import { Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {Appointment} from "../lib/types";
import {styles} from "../assets/styles";
import {formatDate} from "../lib/ourlibrary";

interface turnoContainerProps {
    onPress?: any;
    styleExterior: any;
    date: Date;
    turno: Appointment;
}

const turnoContainer: React.FC<turnoContainerProps> = ({styleExterior, turno, date, onPress, ...props}) => {
    const otraDate = new Date(date);

    return (
        <TouchableOpacity style={[styleExterior, {flexDirection: 'row'}]} {...props} onPress={onPress}>
            <View style={{flexDirection: 'column', padding: 10}}>
                <Text style={[styles.text]}>{otraDate.getHours()}:{otraDate.getMinutes() > 10 ? otraDate.getMinutes() : '0' + otraDate.getMinutes()}</Text>
                <Text style={[styles.text2, {fontSize: 12, width: '150%'}]}>{formatDate(date)}</Text>
            </View>

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
