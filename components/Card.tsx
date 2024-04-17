import React, {ReactNode, useState} from 'react';
import { TouchableOpacity, Text, ViewStyle, TouchableOpacityProps } from 'react-native';

interface CardProps extends TouchableOpacityProps {
    onPress: () => ReactNode;
}

export const Card: React.FC<CardProps> = ({ onPress, ...props }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.card} {...props}>
            <Text>Card Component</Text>
        </TouchableOpacity>
    );
};

const styles: { [key: string]: ViewStyle } = {
    card: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
    },
};
    /*
     <Image
          style={[styles.icon3, styles.iconLayout]}
          resizeMode="cover"
          source={require("../assets/rectangle-105.png")}
        />
          <Pressable
        style={[styles.homeChild3, styles.homeChildPosition]}
        onPress={() => navigation.navigate("Vacunas")}
      />

      iconLayout: {
    height: "100%",
    width: "100%",
  },
     */