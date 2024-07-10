import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView,Text} from 'react-native'
import { getMedications } from '../lib/supabase'
import MedicationButton from "../components/MedicationButton";
import {Button} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"
import { Medication } from '../lib/types';

const Medications: React.FC= ({ navigation, route }: any) => {
    const session = route.params.session;
    const [loading, setLoading] = useState(true)
    const [medications,setMedications]= useState<Medication[] | undefined>(undefined)
    const {t} = useTranslation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setMedications( await getMedications());
                }
            }
            fetchData();
        });

        return unsubscribe;
    }, [navigation, session]);


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
                        medications && medications.length > 0 ? (
                            medications.map((medic: Medication, i) => {
                                //console.log("segundos-------------------------------------")
                                console.log("how often : ",medic.howOften)
                                console.log("name : ",medic.name)
                                return (
                                    <View key={i}>
                                        <MedicationButton onPress={() => navigation.navigate({name: 'SingleMedication', params: {meds: medic}})} meds={medic}></MedicationButton>
                                    </View>
                                )
                            })
                        ) : (
                            <View style={[cardStyle.container]}>
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

export default Medications;

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
        width: "70%"
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