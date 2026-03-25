// src/components/ScrollableBackgroundView.tsx
import React from 'react';
import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';

interface ScrollableBackgroundViewProps extends ViewProps {
    children: React.ReactNode;
}

const ScrollableBackgroundView: React.FC<ScrollableBackgroundViewProps> = ({ children, style, ...props }) => {
    return (
        <View style={[styles.container, style]}>
            <ScrollView contentContainerStyle={[styles.contentContainer]} {...props}>
                {children}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
    },
});

export default ScrollableBackgroundView;
