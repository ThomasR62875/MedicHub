import React from 'react';
import {
    Text,
    TouchableOpacityProps,
    Image,
    Pressable,
    StyleSheet,
    View
} from 'react-native';

interface CardProps extends TouchableOpacityProps {
    onPress:  any;
    img : any;
    title : String;
}

//
// NO ELIMINAR
//
export const Card: React.FC<CardProps> = ({ onPress, img, title, ...props }) => {
    return (
            <Pressable style={styles.conteinter} onPress={onPress}>
                <View style={styles.card}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </Pressable>
    );
};

const styles = StyleSheet.create({

    text: {
        fontSize: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#B5DCCA',
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 3,
        height: 45
    },
    img: {
        height: 150,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    conteinter: {
        justifyContent: 'center',
        width: 170,
    }
});
