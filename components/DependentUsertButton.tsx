import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {DependentUser} from "../screens/DependentUsers";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"


interface DependentUserButtonProps {
    onPress: any;
    du: DependentUser;
}

const DependentUserButton: React.FC<DependentUserButtonProps> = ( { onPress, du }) => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={cardStyle.container}>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('name')}:</Text>
                    <Text>{du.first_name}</Text>
                </View>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('surname')}</Text>
                    <Text>{du.last_name}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default DependentUserButton;
