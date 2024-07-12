import { Text, TouchableOpacity, View} from "react-native";
import React from "react";
import {RecommendationAppointment} from "../lib/types";
import {styles} from "../assets/styles";

interface recommendationAppointmentContainerProps {
    onPress?: any;
    styleExterior: any;
    recommendationAppointment: RecommendationAppointment;
}

const recommendationAppointmentContainer: React.FC<recommendationAppointmentContainerProps> = ({styleExterior, recommendationAppointment, ...props}) => {
    const newDate = new Date(recommendationAppointment.date);
    const formattedDate = `${newDate.getDate().toString().padStart(2, '0')}/${(newDate.getMonth() + 1).toString().padStart(2, '0')}/${newDate.getFullYear()}`;

    return (
        <TouchableOpacity style={[styleExterior, {flexDirection: 'row'}]} {...props}>
            <Text
                style={[styles.text, {padding: 15}]}>{formattedDate}</Text>
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