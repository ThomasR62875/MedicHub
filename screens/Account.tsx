import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {StyleSheet, View, Alert, Text, Modal, ScrollView, Dimensions} from 'react-native'
import {Button, Icon} from 'react-native-elements'

const Account: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [dni, setDni] = useState(0)
    const [avatar_url, setAvatarUrl] = useState('')
    const [showModal, setShowModal] = useState<boolean>(false)
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        if (session) getProfile()
    }, [session])

    async function getProfile() {
        try {
            if (!session?.user) throw new Error('No user on the session!')
            const {data, error} = await supabase.rpc('get_independent_user', {auth_id_input: session?.user.id});

            if (data) {
                setFirstName(data.first_name)
                setLastName(data.last_name)
                setDni(data.dni)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
    }

    // @ts-ignore
    return (
        <View style={{marginTop: screenHeight*0.1}}>
            <ScrollView>
            <View style={styles.iconContainer}>
                <Icon name='build-outline' type='ionicon' size={35} onPress={() => navigation.navigate('EditAccount', {session: session})} />
            </View>
            <View style={styles.grid}>
                <View>
                    <Icon name='person-circle-outline' type='ionicon' size={150} />
                </View>
                <View style={styles.col}>
                    <Text style={{fontSize: 25}}>{first_name}</Text>
                    <Text style={{fontSize: 25}}>{last_name}</Text>
                </View>
            </View>
            <View style={{marginTop: 5}}>
                <Text style={styles.title}>Mail:</Text>
                <Text style={styles.text2}>{session?.user.email}</Text>
                <View style={{ marginTop: 5 }} />
                <Text style={styles.title}>DNI:</Text>
                <Text style={styles.text2}>{dni}</Text>
                <View style={{ marginTop: 15 }} />
                <Button title={<Text style={styles.buttonText}>Mis doctores</Text>}
                        buttonStyle={styles.misCosas}
                        onPress={() => navigation.navigate('Doctors', {session: session})}
                />
                <Button title={<Text style={styles.buttonText}>Mis turnos</Text>}
                        buttonStyle={styles.misCosas}
                        onPress={() => navigation.navigate({name: 'Appointments', params: {session: session}})}/>
                <Button title={<Text style={styles.buttonText}>Mis vacunas</Text>}
                        buttonStyle={styles.misCosas}
                />
                <Button title={<Text style={styles.buttonText}>Mis medicamentos</Text>}
                        buttonStyle={styles.misCosas}
                        onPress={() => navigation.navigate({name: 'Medication', params: {session: session}})}/>
                <Button title={<Text style={styles.buttonText}>Mis archivos</Text>}
                        buttonStyle={styles.misCosas}
                />

                {/* Cuando se entra a esta pestaña no se llega a ver el button de Cerrar sesión todo*/}
                <View style={{marginTop: 10, marginBottom: 10}}>
                    <Button title="Cerrar sesión"
                            onPress={()=>setShowModal(true)}
                            icon={<Icon name="log-in-outline" type="ionicon" size={54} color="white" />}
                            buttonStyle={styles.cerrarSesion}/>
                    <Modal
                        transparent={true}
                        visible={showModal}>
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <View style={[styles.modalInfoContainer, {marginTop: 555}]}>
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
                </View>
            </View>
            </ScrollView>
        </View>
    )
}

export default Account

const styles = StyleSheet.create({
    iconContainer: {
        top: 10,
        left: 305,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B5DCCA',
        justifyContent: 'center',
        alignItems: 'center',
    },
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
        width: '90%',
    },
    misCosas: {
        width: '80%',
        backgroundColor: '#D6EFD4',
        color: 'black',
        borderRadius: 10,
        marginBottom: 5,
        alignSelf: 'center',
    },
    text2: {
        fontSize: 25,
        marginLeft: 10,
    },
    title: {
        fontSize: 22,
        textAlign: "left",
        color: '#808080',
        marginTop: 10,
        marginLeft: 10,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'black',
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
    }
})