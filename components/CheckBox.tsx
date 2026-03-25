import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import {styles} from "../assets/styles";

interface MyCheckBoxProps {
    value: boolean;
    disabled?: boolean;
    onValueChange: (newValue: boolean) => void;
    text: string;
}

const MyCheckBox: React.FC<MyCheckBoxProps> = ({ value, disabled = false, onValueChange, text }) => {
    const handlePress = () => {
        if (!disabled) {
            onValueChange(!value);
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.checkboxContainer,
                {
                    borderColor: value ? '#86ABBA' : '#000',
                    borderBottomWidth: value ? 4 : 1,
                    borderWidth: value ? 4 : 1,
                },
            ]}
            onPress={handlePress}
            disabled={disabled}
        >
            <Icon
                type="font-awesome"
                name="check"
                color={value ? '#86ABBA' : 'transparent'}
                iconStyle={styles.iconCheckBox}
            />
                <Text style={styles.checkboxText} >{text}</Text>
        </TouchableOpacity>
    );
};

export default MyCheckBox;
