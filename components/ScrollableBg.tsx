// src/components/ScrollableBackgroundView.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';

interface ScrollableBackgroundViewProps extends ViewProps {
    children: React.ReactNode;
}

const ScrollableBackgroundView: React.FC<ScrollableBackgroundViewProps> = ({ children, style, ...props }) => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={[styles.contentContainer, style]} {...props}>
                {children}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e9f4e9', // Color de fondo del contenedor
    },
    contentContainer: {
        flexGrow: 1,
        backgroundColor: '#e9f4e9', // Color de fondo del contenido
        padding: 16, // Espacio entre los bordes y el contenido
    },
});

export default ScrollableBackgroundView;
