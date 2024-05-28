import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Doctor} from "../screens/Doctors";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"

interface DoctorButtonProps {
    onPress: any;
    doc: Doctor;
}

const DoctorButton: React.FC<DoctorButtonProps> = ( { onPress, doc }) => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={cardStyle.container}>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('doc')}:</Text>
                    <Text>{doc.name}</Text>
                </View>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('specialty')}</Text>
                    <Text>{doc.specialty}</Text>
                    <View style={{ width: 30 }} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default DoctorButton;
