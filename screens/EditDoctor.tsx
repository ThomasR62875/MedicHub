import React, { useState, useEffect } from 'react'
import {updateDoctor} from '../lib/supabase'
import {View, StyleSheet} from 'react-native'
import {Button, Input} from 'react-native-elements'
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {DependentUser} from "./DependentUsers";
import {Specialty} from "./AddDoctor";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();

    useEffect(() => {
        if (session) getDoc()
    }, [session])

    async function getDoc() {
        setName(route.params.doc.name);
        setEmail(route.params.doc.email);
        setSpecialty(route.params.doc.specialty);
        setPhone(route.params.doc.phone);
        setAddresses(route.params.doc.addresses);
        setUserId(route.params.doc.user_id);
    }

    return(
        <View style={styles.container} >
            <View style={styles.window}>
                <Input label={t('name')} value={name} onChangeText={(text) => setName(text)}/>
                <Input label="Mail" value={email} onChangeText={(text) => setEmail(text)}/>
                <Input label={t('specialty')} value={specialty} onChangeText={(text) => setSpecialty(text)}/>
                <Input label={t('phone')} value={phone} onChangeText={(text) => setPhone(text)}/>
                {/*{addresses ? (
                    addresses.map((address: string, i) => {
                        <Input label={t('address')} value={phone} onChangeText={(text) => setAddresses(address)}/>
                    })}*/}
                <Input label={t('user')} value={user_id} onChangeText={(text) => setUserId(text)}/>
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
                    onPress={() => updateDoctor({email, name, phone, addresses, specialty, user_id})}
                />
            </View>
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
    }
})