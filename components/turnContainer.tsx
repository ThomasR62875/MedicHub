import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Appointment} from "../screens/Appointments";

const turnContainer : ({ ...props}: {
    onPress: any;
    styleExterior: any;
    date : Date
    turno: Appointment
}) => {} = ({onPress, styleExterior, turno, date, ...props}) => {

return (
        <View style={styleExterior}>
            <View style={styles.infoRow}>
                <Text>{turno.description}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.label}>Usuario:</Text>
                <Text>{turno.user_name}</Text>
                <View style={{ width: 30 }} />
                <Text style={styles.label}>Fecha:</Text>
                <Text>{`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`}</Text>
            </View>
        </View>
);}

export default turnContainer


const styles = StyleSheet.create({

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
