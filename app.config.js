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
            supportsTablet: true,
            bundleIdentifier: "com.jtechenski.tpingesoft" // Add this line
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            package: "com.jtechenski.tpingesoft"
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
                projectId: "4ce8f699-ec16-44ff-b06f-ee1f44aee4a4",
            }
        }
    }
};
