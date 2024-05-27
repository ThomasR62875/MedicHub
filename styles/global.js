import { StyleSheet } from "react-native";


export const cardStyle = StyleSheet.create({
    container: {
        backgroundColor: '#cbe4c9',
        borderRadius: 20,
        borderColor: '#cbe4c9',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        minWidth: "100%",
        alignItems: 'center', 
        padding: "5%", 
        marginTop: '5%',
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },


})