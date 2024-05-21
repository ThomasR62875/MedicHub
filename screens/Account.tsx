import React, { useState, useEffect } from 'react'
import { getUser, getUserId, supabase } from '../lib/supabase'
import {StyleSheet, View, Alert, Text, Modal, ScrollView, Dimensions} from 'react-native'
import {Button, Icon} from 'react-native-elements'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import { DependentUser } from './DependentUsers';

const Account: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [dni, setDni] = useState(0)
    const [avatar_url, setAvatarUrl] = useState('')
    const [showModal, setShowModal] = useState<boolean>(false)
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        if (session) {
            async function fetchData() {
                const data : DependentUser= await getUser(await getUserId())
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setDni(parseInt(data.dni.slice(0,8),10))
            }
            fetchData()
        }
    }, [session])

    const size=25;

    return (
        <View style={styles.screen}>
            <ScrollView>
                <View style={styles.topContent}>
                    <Text style={styles.screenTitle}>Perfil</Text>
                </View>
                <View style={styles.main}>
                    <View style={styles.iconContainer}>
                        <Icon
                            name='person-circle-outline'
                            iconStyle={{ color: '#1e3a1a' }}
                            type='ionicon'
                            size={125}
                        />
                    </View>
                    <View style={styles.namesContainer}>
                        <Text style={styles.name}>{first_name}</Text>
                        <Text style={styles.name}>{last_name}</Text>
                    </View>
                    <View style={{marginTop: "12%", marginLeft: '20%'}}>
                        <Icon
                            name='pencil'
                            iconStyle={{ color: '#1E3A1AFF' }}
                            type='ionicon'
                            size={25}
                            style={{margin: "5%"}}
                            onPress={() => navigation.navigate('EditAccount', {session: session})}
                        />
                    </View>
                </View>
                <View style={{marginTop: 5, marginLeft: "10%", marginBottom: "5%"}}>
                    <Text style={styles.title}>Mail:</Text>
                    <Text style={styles.text2}>{session?.user.email}</Text>
                    <View style={{ marginTop: 5 }} />
                    <Text style={styles.title}>DNI:</Text>
                    <Text style={styles.text2}>{dni}</Text>
                    <View style={{ marginTop: 15 }} />
                </View>
                <View style={{alignItems: 'center', width: 'auto'}}>
                    <Button
                        title="Mis doctores"
                        icon={{
                            name: 'doctor',
                            type: 'material-community',
                            size: 20,
                            color: '#12210f',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,

                        }}
                        onPress={() => navigation.navigate({name: 'Doctors', params: {session: session}})}
                    />
                    <Button
                        title="Mis turnos"
                        icon={{
                            name: 'archive-clock',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,

                        }}
                        onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}
                    />
                    <Button
                        title="Mis vacunas"
                        icon={{
                            name: 'needle',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,
                        }}
                    />
                    <Button
                        title="Mis medicamentos"
                        icon={{
                            name: 'pill',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,
                        }}
                        onPress={() => navigation.navigate({name: 'Medication', params: {session: session}})}
                    />
                    <Button
                        title="Mis archivos"
                        icon={{
                            name: 'archive',
                            type: 'material-community',
                            size: 20,
                            color: '#1e3a1a',
                        }}
                        iconContainerStyle={{ marginRight: 10}}
                        titleStyle={styles.buttonText}
                        buttonStyle={styles.misCosas}
                        containerStyle={{
                            width: '80%',
                            marginHorizontal: 50,
                            marginVertical: 2,
                        }}
                    />
                    <Button
                        title="Cerrar sesión"
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50,
                            minWidth: 150,
                        }}
                        containerStyle={{
                            width: 150,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            marginBottom:100
                        }}
                        titleStyle={{ color: '#eef9ed' }}
                        onPress={()=>setShowModal(true)}
                    />
                    </View>

                    {/*    /!* Cuando se entra a esta pestaña no se llega a ver el button de Cerrar sesión todo*!/*/}
                    {/*    <View style={{marginTop: 10, marginBottom: 10}}>*/}
                    {/*        <Button title="Cerrar sesión"*/}
                    {/*                onPress={()=>setShowModal(true)}*/}
                    {/*                icon={<Icon name="log-in-outline" type="ionicon" size={54} color="white" />}*/}
                    {/*                buttonStyle={styles.cerrarSesion}/>*/}
                            <Modal
                                transparent={true}
                                visible={showModal}>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContainer}>
                                        <View style={[styles.modalInfoContainer, ]}>
                                            <Text style={styles.modalText}>¿ Seguro queres cerrar sesion ?</Text>
                                        </View>
                                        <View style={[styles.modalInfoContainer, {marginTop: 15}]}>
                                            <Button title="Cancelar"
                                                    onPress={()=>setShowModal(false)}
                                                    buttonStyle={{backgroundColor: '#073A29'}}/>
                                            <View style={{ width: 30 }} />
                                            <Button title="Cerrar"
                                                    onPress={() => {
                                                        supabase.auth.signOut().then(r => {
                                                            navigation.navigate({name: 'Login', params: {session: session}})} )}}
                                                    buttonStyle={{backgroundColor: '#073A29'}}/>
                                        </View>
                                    </View>
                                </View>
                            </Modal>
                    {/*    </View>*/}
                    {/*</View>*/}

            </ScrollView>
        </View>
    )
}

export default Account

const styles = StyleSheet.create({
    cerrarSesion:{
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#073A29',
        borderRadius: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        marginLeft: 10,
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    misCosas: {
        width: 225,
        backgroundColor: '#cae4c8',
        borderColor: '#cae4c8',
        borderWidth: 1,
        color: 'black',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: "2%"
    },
    text2: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        marginTop: "1%",
        color: "#1a4212",
        width: "60%"
    },
    title: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        marginTop: "1%",
        color: "#245e1e",
        width: "60%"
    },
    buttonText: {
        alignSelf: 'center',
        color: '#12210f',
        fontSize: 20,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        padding: 20,
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        color: 'white',
    },
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
    topContent: {
        alignItems: "center",
        marginTop: "25%",
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        marginBottom: "5%",
        color: "#2E5829FF",
        width: "60%"
    },
    main: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        marginLeft: '5%'
    },
    iconContainer: {
        alignItems: 'flex-start',
    },
    name: {
        color: "#2E5829FF",
        fontSize: 20,
    },
    namesContainer: {
        marginLeft: "2%",
        marginTop: '10%'
    }, icons: {
        color: '#2E5829FF',
    },
    buttonContainer: {
        width: 225, // Ancho deseado para todos los botones
        marginVertical: 10,
    }


})