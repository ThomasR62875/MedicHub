import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView,Text} from 'react-native'
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";
import AddButton from "../components/AddButton";

type MedicationProps = NativeStackScreenProps<RootStackParamList, 'Medication'>;

export type Medication = {
    name: string;
    prescription: string;
}
const Medication: React.FC<MedicationProps> = ({ navigation, route }) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [medications,setMedications]= useState<Medication[] | undefined>(undefined)

    useEffect(() => {
        if(session){
            getMedications().then(data => {
                setMedications(data);
            }).catch(error => {
                console.error("Error al obtener los medicamentos: ", error);
            });
        }
    }, []);
    async function getMedications(): Promise<Medication[] | undefined> {
        let to_return: Medication[] | undefined = undefined

        const {data: user_id,error: user_data_error} = await supabase.rpc('get_independent_user_id')
        if(user_data_error)
            throw new Error(user_data_error.message);

        const {data, error} = await supabase.rpc("get_all_medications_by_user", {user_id: user_id});
        console.log(data)
        if(error){
            throw new Error(error.message);
        }

        if (data.length == 0) {
            setLoading(false)
            return to_return;
        }

        to_return = [];
        data.forEach((medication: Medication) => {
            to_return.push({
                name: medication.name,
                prescription: medication.prescription
            });
        });
        setLoading(false)
        return to_return;
    }
    return(
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Medicamentos</Text>
            </View>
            <View style={styles.addContainer}>
                <AddButton onPress={() => navigation.navigate({name: 'AddMedication', params: {session: session}})}/>
            </View>

            <ScrollView>
                <View>
                    {
                        medications ? (
                            medications.map((medic: Medication, i) => {
                                return (
                                    <View key={i} style={styles.doctorContainer}>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Nombre:</Text>
                                            <Text style={styles.value}>{medic.name}</Text>
                                        </View>
                                        <View style={styles.infoRow}>
                                            <Text style={styles.label}>Prescription:</Text>
                                            <Text style={styles.value}>{medic.prescription}</Text>
                                        </View>
                                    </View>
                                    // AGREGAR PARA VER EL ARRAY DE ADDRESSES
                                )
                            })
                        ) : (
                            <View style={styles.titleContainer}>
                                <Text style={styles.titleText}>No hay medicamentos</Text>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
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
    doctorContainer: {
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
        marginTop: 10,
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
        bottom: 63,
        alignSelf: 'flex-start',
    }

});