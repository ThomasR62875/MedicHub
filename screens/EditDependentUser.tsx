import React, { useState, useEffect } from 'react'
import {supabase, updateDependentUser} from '../lib/supabase'
import {View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard} from 'react-native'
import {Button, Icon, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";

type EditDependentUserProps = NativeStackScreenProps<RootStackParamList, 'EditDependentUser'>;

const EditDependentUser:React.FC<EditDependentUserProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [id, setId] = useState('')
    const [first_name,setFirstName] = useState('')
    const [last_name,setLastName] = useState('')
    const [dni,setDni]  = useState('')
    const {t} = useTranslation();

    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [dniErrorMessage, setDniErrorMessage] = useState('')

    useEffect(() => {
        if (
            first_name.trim() !== '' &&
            last_name.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [first_name, last_name, dni]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);


    useEffect(() => {
        if (session) getDU()
    }, [session])


    const handleUpdateDependentUser = async () => {

        const session =  route.params.session;
        const du  = {id: id , first_name: first_name, last_name: last_name, dni: dni.toString()}
        const result = await updateDependentUser(du);
        if (result.success) {
            Alert.alert(
                t('editDepUser'),
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Usuarios', { session: session }) }
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    async function getDU() {
        setId(route.params.du.id)
        setFirstName(route.params.du.first_name);
        setLastName(route.params.du.last_name);
        setDni(route.params.du.dni)
    }

    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setFirstNameErrorMessage(t('warn17'));
        } else {
            setFirstNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn18'));
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        if (value.trim() === '') {
            setDniErrorMessage(t('warn19'));
        } else {
            setDniErrorMessage('');
        }
    };

    return(
        <View style={styles.container} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.window}>
                    <Input
                        label={t('name')}
                        value={first_name}
                        onChangeText={(text) => {
                            setFirstName(text);
                            validateFirstName(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={firstNameErrorMessage}
                    />
                    <Input
                        label={t('surname')}
                        value={last_name}
                        onChangeText={(text) => {
                            setLastName(text);
                            validateLastName(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={firstNameErrorMessage}
                    />
                    <Input
                        label={t('id')}
                        value={dni.toString()}
                        onChangeText={(text) => {
                            setDni(text);
                            validateDNI(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={dniErrorMessage}
                    />
                    <Button
                        title={t('savec')}
                        buttonStyle={{
                            backgroundColor: '#2E5829',
                            borderWidth: 2,
                            borderColor: 'white',
                            borderRadius: 30,
                            minHeight: 50
                        }}
                        containerStyle={{
                            width: 200,
                            marginHorizontal: 50,
                            marginVertical: 10,
                            marginTop: 40,
                            alignContent: 'center'
                        }}
                        titleStyle={{ color: '#EEF9ED' }}
                        disabled={isButtonDisabled}
                        onPress={handleUpdateDependentUser}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default EditDependentUser

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        alignContent: 'center'
    },
    window: {
        alignItems: 'center',
        marginTop: '20%',
        marginLeft: '5%',
        marginRight: '5%'
    }
})