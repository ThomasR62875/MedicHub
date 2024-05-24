import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, ScrollView,Text} from 'react-native'
import MedicationButton from "../components/MedicationButton";
import {Button} from "react-native-elements";
import {useTranslation} from "react-i18next";

export type Medication = {
    id: string;
    name: string;
    prescription: string;
}

const Medication: React.FC = ({ navigation, route }: any) => {
    const session = route.params.session;
    const [loading, setLoading] = useState(true)
    const [medications,setMedications]= useState<Medication[] | undefined>(undefined)
    const {t} = useTranslation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (session) {
                setLoading(true);
                getMedications().then(data => {
                    setMedications(data);
                }).catch(error => {
                    console.error(t('warn12'), error);
                }).finally(() => {
                    setLoading(false);
                });
            }
        });

        // Cleanup the listener on unmount
        return unsubscribe;
    }, [navigation, session]);

    async function getMedications(): Promise<Medication[] | undefined> {
        let to_return: Medication[] | undefined = undefined

        const {data: user_id,error: user_data_error} = await supabase.rpc('get_independent_user_id')
        if(user_data_error)
            throw new Error(user_data_error.message);

        const {data, error} = await supabase.rpc("get_all_medications_by_user", {user_id: user_id});
        if(error){
            throw new Error(error.message);
        }

        if (data.length == 0) {
            setLoading(false)
            return to_return;
        }

        to_return = [];
        data.forEach((medication: Medication) => {
            // @ts-ignore
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
            <View style={styles.window}>
                <View style={styles.topContent}>
                    <Text style={styles.titleText}>{t('medicine')}</Text>
                    <Button
                        title={t('add')}
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderColor: 'white',
                            borderRadius: 20,
                            minHeight: 10,
                            minWidth: 10,
                        }}
                        titleStyle={{ color: '#E9F4E9',fontSize: 15, margin: 5 }}
                        onPress={() => navigation.navigate('AddMedication', {session: session})}/>
                </View>
            <ScrollView>
                <View>
                    {
                        medications ? (
                            medications.map((medic: Medication, i) => {
                                return (
                                    <View key={i} style={styles.medsContainer}>
                                        <MedicationButton onPress={() => navigation.navigate({name: 'SingleMedication', params: {meds: medic}})} styleExterior={styles.medsContainer} meds={medic}></MedicationButton>
                                        <View style={{ marginBottom: 100 }} />
                                    </View>
                                )
                            })
                        ) : (
                            <View style={[styles.titleContainer]}>
                                <Text style={styles.text}>{t('text16')}</Text>
                            </View>
                        )
                    }
                </View>
            </ScrollView>
            </View>
        </View>
    )
}

export default Medication;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
      },
    medsContainer: {
        marginTop: '5%',
        alignItems: 'center',
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
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    },
    addContainer: {
        left: 290,
        bottom: 63,
        alignSelf: 'flex-start',
    },
    window: {
        marginTop: "20%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    topContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: "5%",

    },
    text: {
        fontFamily: 'Roboto-Thin',
        fontSize: 14,
        textAlign: 'left',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    }
});