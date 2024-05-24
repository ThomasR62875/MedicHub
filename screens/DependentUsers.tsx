import React, { useState, useEffect } from 'react'
import { getDependentUsers} from '../lib/supabase'
import {StyleSheet, View, ScrollView, Text, Dimensions} from 'react-native'
import {Button} from "react-native-elements";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {useTranslation} from "react-i18next";

const Stack = createNativeStackNavigator();

// UNA IDEA DE DEPENDENT USERS SERIA PODER VER CADA USUARIO Y EDITARLO DESDE AHI (por ej eliminarlo, lo de migrar info etc)
// TAMBIEN QUE CUANDO ABRIMOS UN USUARIO DEPENDEDIENTE, NOS DESPIEGLUE SU INFO (doctores, appointments, etc) todo

export type DependentUser = {
    first_name: string;
    last_name: string;
    dni: string;
    id: string;
}

const DependentUsers: React.FC = ({navigation, route} : any) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [users,setUsers]= useState([])
    const [dependent_users,setDependentUsers]= useState<DependentUser[] | undefined>(undefined)
    const screenHeight = Dimensions.get('window').height;
    const percentageMargin = screenHeight * 0.05;
    const {t} = useTranslation();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            async function fetchData() {
                setDependentUsers(await getDependentUsers(session.id))
            }  
            fetchData()
        });

        return unsubscribe;
    }, [navigation, session]);

return(
    <View style={styles.container}>
        <View style={styles.window}>
            <View style={styles.topContent}>
                <Text style={styles.titleText}>{t('depu')}</Text>
                <Button
                    title={t('add')}
                    buttonStyle={{
                        backgroundColor: '#2E5829',
                        borderColor: 'white',
                        borderRadius: 20,
                        minHeight: 10,
                        minWidth: 10,
                    }}
                    titleStyle={{ color: '#E9F4E9FF',fontSize: 15, margin: 5 }}
                    onPress={() => navigation.navigate('AddDependentUser', {session: session})}/>
            </View>
            <ScrollView style={{width:'90%', marginTop: percentageMargin }}>
                {dependent_users && dependent_users.length >0 ? (
                    dependent_users.map((d_user: DependentUser, i) => {
                    return (
                        <View key={i} style={[styles.userContainer, {alignItems: 'center', padding: "5%", marginTop: '5%',}]}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{t('name')}:</Text>
                                <Text style={styles.value}>{d_user.first_name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{t('surname')}:</Text>
                                <Text style={styles.value}>{d_user.last_name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>{t('id')}:</Text>
                                <Text style={styles.value}>{d_user.dni}</Text>
                            </View>
                        </View>
                    )
                })) : (
                    <View style={[styles.userContainer]}>
                        <Text style={styles.text}>{t('text18')}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    </View>
)
}

export default DependentUsers;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#e9f4e9",
    },
    userContainer: {
        backgroundColor: '#cbe4c9',
        borderRadius: 20,
        borderColor: '#cbe4c9',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        minWidth: "100%",
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
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'left',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829FF",
        width: "70%"
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
        margin: '5%',
        color: "#215a1b"
    },
    window: {
        marginTop: "25%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    topContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }

});