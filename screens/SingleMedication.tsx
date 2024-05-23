import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Icon} from "react-native-elements";

type SingleMedicationProps = NativeStackScreenProps<RootStackParamList, 'SingleMedication'>


const SingleMedication: React.FC<SingleMedicationProps> = ({ navigation, route }: any) => {
    //const { medID } = route.params;
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Detalles del</Text>
                <Text style={styles.titleText}>Medicamento</Text>
            </View>
            <View style={styles.addContainer}>
                <Icon
                    name='pencil'
                    iconStyle={{ color: '#1E3A1A' }}
                    type='ionicon'
                    size={25}
                    style={{margin: "5%"}}
                    onPress={() => navigation.navigate('EditMedication', {medication: route.params.meds})}
                />
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{route.params.meds.name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Prescripción:</Text>
                <Text style={styles.value}>{route.params.meds.prescription}</Text>
            </View>
        </View>
    );
};

export default SingleMedication;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e9f4e9',
    },
    titleContainer: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    }
});
