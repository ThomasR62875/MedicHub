import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {styles} from "../assets/styles";

interface DoctorButtonProps {
    children: React.ReactNode;
    onPress: any;
}

const DoctorButton: React.FC<DoctorButtonProps> = ( { children,onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.cards]}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

export default DoctorButton;
