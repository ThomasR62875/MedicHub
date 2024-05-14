import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {StyleSheet, View, Alert, ScrollView, Text, Dimensions} from 'react-native'
import AddButton from "../components/AddButton";
import {Button} from "react-native-elements";
import {RootStackParamList} from "../App";
import {createNativeStackNavigator, NativeStackScreenProps} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

// UNA IDEA DE DEPENDENT USERS SERIA PODER VER CADA USUARIO Y EDITARLO DESDE AHI (por ej eliminarlo, lo de migrar info etc)
// TAMBIEN QUE CUANDO ABRIMOS UN USUARIO DEPENDEDIENTE, NOS DESPIEGLUE SU INFO (doctores, appointments, etc) todo

export type DependentUser = {
    first_name: string;
    last_name: string;
    dni: string;
    id: string;
}

type DependentUsersProps = NativeStackScreenProps<RootStackParamList, 'DependentUsers'>;


const DependentUsers: React.FC = ({navigation, route} : any) => {
    const {session} = route.params;
    const [loading, setLoading] = useState(true)
    const [users,setUsers]= useState([])
    const [dependent_users,setDependentUsers]= useState<DependentUser[] | undefined>(undefined)
    const screenHeight = Dimensions.get('window').height;
    const percentageMargin = screenHeight * 0.05;

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (session) {
                getUsers();
            }
        });

        return unsubscribe;
    }, [navigation, session]);


    async function getUsers():Promise<DependentUser[]> {
        let to_return: DependentUser[]=[]
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error} = await supabase.rpc("get_dependent_users")
            if (error) {
                throw error
            }
            if (data) {
                data.forEach( (dependent_user: DependentUser) => {
                    to_return.push({
                        first_name: dependent_user.first_name,
                        last_name: dependent_user.last_name,
                        dni: dependent_user.dni,
                        id: dependent_user.id
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
    <View style={styles.container}>
        <View style={styles.window}>
            <View style={styles.topContent}>
                <Text style={styles.titleText}>Usuarios Dependientes</Text>
                <Button
                    title="Agregar"
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
                        <View key={i} style={[styles.userContainer, {alignItems: 'center'}]}>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Nombre:</Text>
                                <Text style={styles.value}>{d_user.first_name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Apellido:</Text>
                                <Text style={styles.value}>{d_user.last_name}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Mail:</Text>
                                <Text style={styles.value}>{d_user.dni}</Text>
                            </View>
                        </View>
                    )
                })) : (
                    <View style={[styles.userContainer]}>
                        <Text style={styles.text}>Aún no tienes usuarios dependientes </Text>
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
        height: "100%"
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
        minHeight: '50%',
        minWidth: "100%",
        margin: "1%"
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
        width: "60%"
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
        margin: '5%',
        color: "#215a1b"
    },
    window: {
        marginTop: "30%",
        marginLeft: "5%",
        marginRight: "5%",
    },
    topContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }

});