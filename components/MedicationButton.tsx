import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Medication} from '../lib/types';
import {styles} from "../assets/styles";

interface MedicationButtonProps {
    children: React.ReactNode;
    onPress: any;
    meds: Medication;
}

const MedicationButton: React.FC<MedicationButtonProps> = ( { children, onPress, meds }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.cards]}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

export default MedicationButton;