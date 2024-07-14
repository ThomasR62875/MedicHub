import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, PermissionsAndroid } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import { getAdvertisement } from "../lib/supabase";
import {Button} from "react-native-elements";
import { Advertisement, Doctor } from '../lib/types';
import { BigBanner } from '../components/BigBanner';
import { styles } from '../assets/styles';
type AlertPublicityProps = NativeStackScreenProps<RootStackParamList, 'AlertPublicity'>

const AlertPublicity: React.FC<AlertPublicityProps> = ({navigation, route} ) => {
    const {t} = useTranslation();
    const { session, msg, screen, appointment , du, doc, meds } = route.params;
    const [advertisement, setAdvertisement]= useState<Advertisement | undefined>()
    const [publicity,setPublicity]= useState(true)
    const handleNavigateBack = () => {
        const params: any = { session: session };
        if (appointment) params.appointment = appointment;
        if (du) params.du = du;
        if (doc) params.doc = doc;
        if (meds) params.meds = meds;

        // @ts-ignore
        navigation.navigate(screen, params);
    };
    
    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setAdvertisement( await getAdvertisement('BIG'));
                }
            }
            fetchData();
        });
    },[publicity]);
    return (
        <View style={ownStyles.container}>
            <View style={ownStyles.titleContainer}>
                <Text style={ownStyles.titleText}>{t(msg)}</Text>
            </View>
            <BigBanner advertisement={advertisement} visible={publicity} onPress={(doc:Doctor)=>navigation.navigate({name:'AddDoctor',params:{base_doctor:doc}})}/>
            <View style={{alignItems: 'center', marginTop:0}}>
                <Button
                    title={t('ok')}
                    buttonStyle={[{
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                    },ownStyles.color]}
                    containerStyle={{
                        width: 150,
                        paddingTop:'5%'
                    }}
                    titleStyle={{ color: '#eef9ed' }}
                    onPress={handleNavigateBack}
                />
            </View>
        </View>
    );
};

export default AlertPublicity;

const ownStyles = StyleSheet.create({
    color:{
        backgroundColor:'#86abba',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    titleContainer: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    value: {
        flex: 1,
    },
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
});
