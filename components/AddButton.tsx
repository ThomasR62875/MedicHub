import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
interface AddButtonProps {
    onPress: any;
}

const AddButton: React.FC<AddButtonProps> = ( { onPress }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.iconContainer}>
                <Icon name="add" type="material" size={24} color="white" />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#073A29',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1000,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddButton;
