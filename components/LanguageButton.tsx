import React, { useState } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {useTranslation} from "react-i18next";
import resources from "../translations/config";
import {styles} from "../assets/styles";

const data = Object.keys(resources).map(lang => ({
    label: lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase(),
    value: lang,
}));

const DropdownComponent = () => {
    const [value, setValue] = useState<string | null>(null);
    const {t, i18n} = useTranslation();
    const renderItem = (item: { label: any; }) => (
        <View style={styles.item}>
            <Text style={styles.textStyle}>{item.label}</Text>
            <View style={styles.separator}/>
        </View>
    );

    return (
        <Dropdown
            style={styles.dropdown}
            selectedTextStyle={styles.textStyle}
            placeholderStyle={{padding: '5%'}}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={t('language')}
            containerStyle={styles.dropdownContainer}
            value={value}
            renderItem={renderItem}
            onChange={item => {
                setValue(item.value);
                i18n.changeLanguage(item.value)
            }}
        />
    );
};

export default DropdownComponent;