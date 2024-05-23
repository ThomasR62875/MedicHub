import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {Doctor} from "./Doctors";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Icon} from "react-native-elements";

type SingleDoctorProps = NativeStackScreenProps<RootStackParamList, 'SingleDoctor'>


const SingleDoctor: React.FC<SingleDoctorProps> = ({ navigation, route }: any) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Detalles del Doctor</Text>
            </View>
            <View style={styles.addContainer}>
                <Icon
                    name='pencil'
                    iconStyle={{ color: '#1E3A1AFF' }}
                    type='ionicon'
                    size={25}
                    style={{margin: "10%"}}
                    onPress={() => navigation.navigate('EditAccount')}
                />
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Nombre:</Text>
                <Text style={styles.value}>{route.params.doc.name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Especialidad:</Text>
                <Text style={styles.value}>{route.params.doc.specialty}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Mail:</Text>
                <Text style={styles.value}>{route.params.doc.email}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Teléfono:</Text>
                <Text style={styles.value}>{route.params.doc.phone}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Dirección:</Text>
                <Text style={styles.value}>{route.params.doc.addresses}</Text>
            </View>
        </View>
    );
};

export default SingleDoctor;

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
