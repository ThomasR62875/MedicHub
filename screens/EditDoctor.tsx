import React, { useState, useEffect } from 'react'
import {getAllUsers, getSpecialties, getUserId, updateDependentUser, updateDoctor} from '../lib/supabase'
import {View, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback} from 'react-native'
import {Button, Input, Text} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import StandardGreenButton from "../components/StandardGreenButton";
import {DependentUser} from "./DependentUsers";
import {Specialty} from "./AddDoctor";
import {useTranslation} from "react-i18next";
import RNPickerSelect from "react-native-picker-select";

type EditDoctorProps = NativeStackScreenProps<RootStackParamList, 'EditDoctor'>;

const EditDoctor:React.FC<EditDoctorProps> = ({navigation, route }: any) =>{
    const {session} = route.params;
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [specialties, setSpecialties] = useState<Specialty[] | null>(null);
    const [specialty,setSpecialty]= useState('')
    const [phone, setPhone] = useState('')
    const [addresses, setAddresses] = useState<[string]>([''])
    const [all_users, setAllUsers] = useState<DependentUser[] | undefined>(undefined)
    const [session_user_id, setSessionUserId] = useState('')
    const [user_id, setUserId] = useState('')
    const [id, setId] = useState('')
    const {t} = useTranslation();
    const [nameErrorMessage, setNameErrorMessage] = useState('')


    useEffect(() => {
        if (
            name.trim() !== '' &&
            nameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [name, specialty]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (session){
            async function fetchData() {
                // @ts-ignore
                setSpecialties(await getSpecialties())
                setAllUsers(await getAllUsers(await getUserId()))
            }
            fetchData()
        }
    }, [session])

    const validateName = (value: string) => {
        if (value.trim() === '') {
            setNameErrorMessage(t('warn1'));
        } else {
            setNameErrorMessage('');
        }
    };

    useEffect(() => {
        if (session) getDoc()
    }, [session])

    async function getDoc() {
        setId(route.params.doc.id);
        setName(route.params.doc.name);
        setEmail(route.params.doc.email);
        setSpecialty(route.params.doc.specialty);
        setPhone(route.params.doc.phone);
        setAddresses(route.params.doc.addresses);
        setUserId(route.params.doc.user_id);
    }

    const handleUpdateDoctor = async () => {

        const session =  route.params.session;
        const doc  = {id: id , name: name, specialty: specialty, phone: phone, email: email, addresses: addresses, user_id: user_id}
        const result = await updateDoctor(doc);
        if (result.success) {
            Alert.alert(
                t('editDoc'),
                '',
                [
                    { text: 'Ok', onPress: () => navigation.navigate('Doctors', { session: session }) }
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    return(
        <View style={styles.container} >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <View style={styles.window}>
                    <Input
                        label={t('name')}
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            validateName(text)
                        }}
                        errorStyle={{ color: 'red' }}
                        errorMessage={nameErrorMessage}
                    />
                    <Input label="Mail" value={email} onChangeText={(text) => setEmail(text)}/>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            placeholder={{ label: t('specialty'), value: null }}
                            items={specialties ? specialties.map(s => ({ label: s.name, value: s.name })) : []}
                            onValueChange={(value) =>
                                setSpecialty(value)
                            }
                            style={{ ...pickerSelectStyles }}
                            value={specialty}
                        />
                    </View>
                    <Input label={t('phone')} value={phone} onChangeText={(text) => setPhone(text)}/>
                    <View style={styles.verticallySpaced}>
                        <Input
                            label={t('address')}
                            leftIcon={{ type: 'font-awesome', name: 'map-marker' }}
                            onChangeText={(text) => setAddresses([text])}
                            value={addresses[0] || ''}
                            placeholder={t('address')}
                            autoCapitalize={'none'}
                        />
                    </View>
                    <View style={styles.pickerStyle}>
                        <RNPickerSelect
                            placeholder={{ label: t('user'), value: null }}
                            items={all_users ? all_users.map(u => ({ label: u.first_name, value: u.id})) : []}
                            onValueChange={(value) =>
                                setUserId(value)
                            }
                            style={{ ...pickerSelectStyles }}
                            value={user_id}
                        />
                    </View>
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
                        titleStyle={{ color: '#eef9ed' }}
                        disabled={isButtonDisabled}
                        onPress={handleUpdateDoctor}
                    />
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default EditDoctor

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
    },
    pickerStyle: {
        marginBottom: 20,
    },
    verticallySpaced: {
        alignSelf: 'stretch',
    },
    title: {
        color: "4522345"
    },
})

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30,
    },
});