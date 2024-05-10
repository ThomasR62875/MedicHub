import {StyleSheet, Text, View} from "react-native";
import React from "react";
import {Appointment} from "../screens/Appointments";

interface turnoContainerProps {
    onPress? : any;
    styleExterior: any;
    date : Date;
    turno: Appointment;
}
const turnoContainer : React.FC<turnoContainerProps>= ({ styleExterior, turno, date, ...props }) => {

        return (
            <View style={styleExterior}>
                <View style={styles.infoRow}>
                    <Text style={{textAlign: 'center'}}>{turno.description}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Usuario:</Text>
                    <Text>{turno.user_name}</Text>
                    <View style={{ width: 30 }} />
                    <Text style={styles.label}>Fecha:</Text>
                    <Text>jeje juju {/*}${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}*/}</Text>
                </View>
            </View>
        );
}

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

export default turnoContainer;
