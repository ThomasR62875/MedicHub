import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useTranslation} from "react-i18next";
import {styles} from "../assets/styles";
import {Doctor} from "../lib/types";

interface DoctorButtonProps {
    children: React.ReactNode;
    onPress: any;
    doc: Doctor;
}

const DoctorButton: React.FC<DoctorButtonProps> = ( { children,onPress, doc }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.cards]}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

export default DoctorButton;
