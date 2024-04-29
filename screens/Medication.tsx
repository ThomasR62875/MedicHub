import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import React from "react";
import {StyleSheet, Text, View} from "react-native";


type MedicationProps = NativeStackScreenProps<RootStackParamList, 'Medication'>;


const Medication: React.FC<MedicationProps> = ({ navigation, route }) =>{
    const {session} = route.params;
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Medicamentos</Text>
            </View>
            <View style={{marginTop: 50, alignItems: 'center'}}>
                <Text>Proximamente en el sprint 3</Text>
            </View>
        </View>
    )
}

export default Medication;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    medContainer: {
        marginTop: 10,
        backgroundColor: '#C2E5D3',
        marginBottom: 10,
        borderRadius: 5,
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
    titleContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    }

});