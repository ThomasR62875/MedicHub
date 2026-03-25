import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from "../assets/styles";

interface MedicationButtonProps {
    children: React.ReactNode;
    onPress: any;
}

const MedicationButton: React.FC<MedicationButtonProps> = ({children, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.cards]}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

export default MedicationButton;