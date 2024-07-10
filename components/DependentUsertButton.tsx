import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ViewProps} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"
import {styles} from "../assets/styles";
import {DependentUser} from "../lib/types";


interface DependentUserButtonProps extends ViewProps {
    children: React.ReactNode;
    onPress: any;
    du: DependentUser;
}

const DependentUserButton: React.FC<DependentUserButtonProps> = ( { children, onPress,style,du, ...props }) => {
    const navigation = useNavigation();
    const {t} = useTranslation();

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.cards}  {...props}>
                {children}
            </View>
        </TouchableOpacity>
    );
};

export default DependentUserButton;
