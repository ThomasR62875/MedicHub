import React, {ReactNode} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';


interface UnderlinedTextProps {
    children: ReactNode;
}
const UnderlinedText = ({ children } : UnderlinedTextProps) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                {children}
            </Text>
            <Svg height="2" width="90%">
                <Line x1="0" y1="0" x2="100%" y2="0" stroke="black" strokeWidth="2" />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 17,
        marginTop: "1%",
        color: "#245e1e",
    },
});

export default UnderlinedText;
