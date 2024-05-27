import 'dotenv/config';

export default {
    expo: {
        name: "TP Inge Soft",
        slug: "tp-inge-soft",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: process.env.EXPO_APK
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-font",
            "expo-router"
        ],
        extra: {
            router: {
                origin: false
            },
            eas: {
                projectId: process.env.EXPO_PROJECT
            }
        }
    }
};
