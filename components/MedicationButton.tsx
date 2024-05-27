import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Medication} from "../screens/Medication";
import {useTranslation} from "react-i18next";

interface MedicationButtonProps {
    onPress: any;
    styleExterior: any;
    meds: Medication;
}

const MedicationButton: React.FC<MedicationButtonProps> = ( { onPress, styleExterior, meds }) => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styleExterior}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>{t('medicine')}:</Text>
                    <Text>{meds.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>{t('prescription')}:</Text>
                    <Text>{meds.prescription}</Text>
                    <View style={{ width: 30 }} />
                </View>
                { meds.howOften != null && (
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>{t('text23')}:</Text>
                        <Text>{parseInt(meds.howOften.toString().split(':')[0], 10)} {t('text24')}</Text>
                    </View>
                )}
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

export default MedicationButton;
