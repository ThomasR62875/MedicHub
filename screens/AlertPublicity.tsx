import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";
import {} from "../lib/supabase";
import {Button} from "react-native-elements";

type AlertPublicityProps = NativeStackScreenProps<RootStackParamList, 'AlertPublicity'>

const AlertPublicity: React.FC<AlertPublicityProps> = ({navigation, route} ) => {
    const {t} = useTranslation();
    const { session, msg, screen, appointment , du, doc, meds } = route.params;

    const handleNavigateBack = () => {
        const params: any = { session: session };

        if (appointment) params.appointment = appointment;
        if (du) params.du = du;
        if (doc) params.doc = doc;
        if (meds) params.meds = meds;

        // @ts-ignore
        navigation.navigate(screen, params);
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{t(msg)}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
                <Button
                    title={t('ok')}
                    buttonStyle={{
                        backgroundColor: '#2E5829',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50
                    }}
                    containerStyle={{
                        width: 150,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        marginTop: 40,
                    }}
                    titleStyle={{ color: '#eef9ed' }}
                    onPress={handleNavigateBack}
                />
            </View>
        </View>
    );
};

export default AlertPublicity;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e9f4e9',
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
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    },
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
    dialog:{
        backgroundColor: '#E9F4E9FF',

    }
});
