import React, { useState, useEffect } from 'react'
import { getDoctors} from '../lib/supabase'
import { StyleSheet, View, ScrollView,Text} from 'react-native'
import {createNativeStackNavigator, NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from "../App";
import {Button} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"

const Stack = createNativeStackNavigator();

export type Doctor = {
    id:string;
    name: string;
    specialty: string;
    phone: string;
    email: string;
    addresses: string[];
    user_id:string;
}

type DoctorProps = NativeStackScreenProps<RootStackParamList, 'Doctors'>;

const Doctors: React.FC= ({ navigation, route }: any) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [doctors,setDoctors]= useState<Doctor[] | undefined>(undefined)
    const {t} = useTranslation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setDoctors( await getDoctors());
                }
            }
            fetchData();
        });

        // Cleanup the listener on unmount
        return unsubscribe;
    }, [navigation, session]);

    return(
        <View style={styles.container}>
            <View style={styles.window}>
                <View style={styles.topContent}>
                    <Text style={styles.titleText}>{t('doc')}</Text>
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
                        onPress={() => navigation.navigate('AddDoctor', {session: session})}/>
                </View>
            <ScrollView>
                <View>
                    {doctors && doctors?.length > 0  ? (
                            doctors.map((doc: Doctor, i) => {
                                return (
                                    <View key={i} style={cardStyle.container}>
                                        <View style={cardStyle.infoRow}>
                                            <Text style={cardStyle.label}>{t('name')}:</Text>
                                            <Text style={cardStyle.value}>{doc.name}</Text>
                                        </View>
                                        <View style={cardStyle.infoRow}>
                                            <Text style={cardStyle.label}>{t('specialty')}:</Text>
                                            <Text style={cardStyle.value}>{doc.specialty}</Text>
                                        </View>
                                        <View style={cardStyle.infoRow}>
                                            <Text style={cardStyle.label}>Mail:</Text>
                                            <Text style={cardStyle.value}>{doc.email}</Text>
                                        </View>
                                        <View style={cardStyle.infoRow}>
                                            <Text style={cardStyle.label}>{t('phone')}:</Text>
                                            <Text style={cardStyle.value}>{doc.phone}</Text>
                                        </View>
                                        <View style={cardStyle.infoRow}>
                                            <Text style={cardStyle.label}>{t('address')}:</Text>
                                            <Text style={cardStyle.value}>{doc.addresses}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        ) : (
                        <View style={[cardStyle.container]}>
                            <Text style={[cardStyle.text, {textAlign: 'center'}]}>{t('text17')}</Text>
                        </View>
                        )
                    }
                </View>
            </ScrollView>
            </View>
        </View>
    )
}

export default Doctors;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
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
        marginTop: "1%",
        color: "#2E5829FF",
        width: "60%"
    }
});
