import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {Medication} from "../screens/Medication";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"

interface MedicationButtonProps {
    onPress: any;
    meds: Medication;
}

const MedicationButton: React.FC<MedicationButtonProps> = ( { onPress, meds }) => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    return (
        <TouchableOpacity style={cardStyle.container} onPress={onPress}>
            <View>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('medicine')}:</Text>
                    <Text>{meds.name}</Text>
                </View>
                <View style={cardStyle.infoRow}>
                    <Text style={cardStyle.label}>{t('prescription')}:</Text>
                    <Text>{meds.prescription}</Text>
                </View>
                {meds.howOften != null ? (
                    <View style={cardStyle.infoRow}>
                        <Text style={cardStyle.label}>{t('text23')}:</Text>
                        <Text>{parseInt(meds.howOften.toString().split(':')[0], 10)} {t('text24')}</Text>
                    </View>
                ) : (<Text> no hay una goma en howOFten porq algo anda mal {meds.howOften} s </Text>)
                }
            </View>
        </TouchableOpacity>
    );
};

export default MedicationButton;
