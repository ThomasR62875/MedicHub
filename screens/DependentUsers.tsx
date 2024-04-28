import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView,Text} from 'react-native'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Doctor} from "./Doctors";

type DependentUsersProps = NativeStackScreenProps<RootStackParamList, 'DependentUsers'>;


type DependentUser = {
    first_name: string;
    last_name: string;
    dni: string;
}

const DependentUsers: ({navigation, route}: { navigation: any; route: any }) => void = ({ navigation, route }) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [users,setUsers]= useState([])
    const [dependent_users,setDependentUsers]= useState<DependentUser[] | undefined>(undefined)


    useEffect(() => {
        if (session) getUsers()
    }, [session])
    async function getUsers():Promise<DependentUser[]> {
        let to_return: DependentUser[]=[]
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error, status} = await supabase.rpc("get_dependent_users")
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                data.forEach( (dependent_user: DependentUser) => {
                    to_return.push({
                        first_name: dependent_user.first_name,
                        last_name: dependent_user.last_name,
                        dni: dependent_user.dni
                    })
                });
            }
        
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
        setLoading(false)
        setDependentUsers(to_return)
        return to_return;
    }
return(
    <View>
        {dependent_users && dependent_users.map((d_user: DependentUser, i) => (
            <View key={i} style={styles.doctorContainer}>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Nombre:</Text>
                    <Text style={styles.value}>{d_user.first_name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Especialidad:</Text>
                    <Text style={styles.value}>{d_user.last_name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Mail:</Text>
                    <Text style={styles.value}>{d_user.dni}</Text>
                </View>
            </View>
        ))}
    </View>
)
}

export default DependentUsers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    doctorContainer: {
        marginTop: 20,
        backgroundColor: '#C2E5D3',
        marginBottom: 20,
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