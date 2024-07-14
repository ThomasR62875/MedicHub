import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

interface MyCheckBoxProps {
    value: boolean;
    disabled?: boolean;
    onValueChange: (newValue: boolean) => void;
    text?: string; // Nuevo prop para el texto dentro del checkbox
}

const MyCheckBox: React.FC<MyCheckBoxProps> = ({ value, disabled = false, onValueChange, text }) => {
    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    return (
        <TouchableOpacity
            style={[styles.checkbox, { backgroundColor: value ? '#007AFF' : '#FFF' }]}
            onPress={handlePress}
            disabled={disabled}
        >
            {value && <View style={styles.innerCheckbox}><Text style={styles.checkboxText}>{text}</Text></View>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    innerCheckbox: {
        width: 16,
        height: 16,
        backgroundColor: '#007AFF',
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        color: '#FFF',
        fontSize: 12,
    },
});

export default MyCheckBox;
