import { Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {useTranslation} from "react-i18next";
import {Appointment, RecommendationAppointment} from "../lib/types";
import {styles} from "../assets/styles";

interface recommendationAppointmentContainerProps {
    onPress?: any;
    styleExterior: any;
    recommendationAppointment: RecommendationAppointment;
}

const recommendationAppointmentContainer: React.FC<recommendationAppointmentContainerProps> = ({styleExterior, recommendationAppointment, ...props}) => {
    const newDate = new Date(recommendationAppointment.date);

    return (
        <TouchableOpacity style={[styleExterior, {flexDirection: 'row'}]} {...props}>
            <Text
                style={[styles.text, {padding: 15}]}>{newDate.getHours()}:{newDate.getMinutes() > 10 ? newDate.getMinutes() : '0' + newDate.getMinutes()}</Text>
            <View style={{padding: 10}}>
                <View style={[styles.infoRow,{paddingHorizontal: 10, paddingVertical: 2}]}>
                    <Text style={{textAlign: 'center'}}>{recommendationAppointment.speciality}</Text>
                </View>
                <View style={[styles.infoRow,{paddingHorizontal: 10, paddingVertical: 2}]}>
                    <Text style={{color: '#A8A8A8', fontSize: 12}}>{recommendationAppointment.user_name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default recommendationAppointmentContainer;