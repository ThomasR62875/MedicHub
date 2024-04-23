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
    img : string;
    title : String;
}

export const Card: React.FC<CardProps> = ({ onPress, img, title, ...props }) => {
    return (
            <Pressable onPress={onPress}>
                <Image style={styles.img} source={require(img)} />
                <View style={styles.card}>
                    <Text style={styles.text}>{title}</Text>
                </View>
            </Pressable>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    },
    card: {
        backgroundColor: "#B5DCCA", //no esta funcionando todo
        padding: 15,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        elevation: 3,
    },
    img: {

    }
});

