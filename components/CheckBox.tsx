import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';

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
                iconStyle={styles.icon}
            />
                <Text style={styles.checkboxText} >{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginHorizontal: '3.5%',
        marginBottom: '5%',
        backgroundColor: '#ffffff',
        borderBottomWidth: 4,
        borderRadius: 15,
        height: 50,
        width: '90%',
    },
    icon: {
        fontSize: 14,
        marginRight: 10,
        alignSelf: 'flex-start',
    },
    checkboxText: {
    color: '#000',
    fontSize: 14,
    marginLeft: 10,
    textAlign: 'center'
    },
});

export default MyCheckBox;
