import React, { useState } from 'react';
import {StyleSheet, View, Text} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import {useTranslation} from "react-i18next";
import resources from "../translations/config";

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

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        width: 100,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRadius: 15,
        minHeight: 50,
        minWidth: 100,
    },
    textStyle: {
        fontSize: 16,
    },
    dropdownContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
    },
    item: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    separator: {
        height: 0.5,
        backgroundColor: '#d3d3d3',
    },
});