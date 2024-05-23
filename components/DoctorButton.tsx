import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Doctor} from "../screens/Doctors";

interface DoctorButtonProps {
    onPress: any;
    styleExterior: any;
    doc: Doctor;
}

const DoctorButton: React.FC<DoctorButtonProps> = ( { onPress, styleExterior, doc }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styleExterior}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text>{doc.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Prescripción:</Text>
                    <Text>{doc.specialty}</Text>
                    <View style={{ width: 30 }} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '90%',
        height: 100,
        borderRadius: 28,
        backgroundColor: '#C2E5D3',
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

export default DoctorButton;
