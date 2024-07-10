import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import { deleteMedication } from "../lib/supabase";
import StandardGreenButton from "../components/StandardGreenButton";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog} from "react-native-paper";

type SingleMedicationProps = NativeStackScreenProps<RootStackParamList, 'SingleMedication'>


const SingleMedication: React.FC<SingleMedicationProps> = ({ navigation, route }: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
    const handleDeleteMedication = async () => {
        const session = route.params.session;
        const medication = route.params.meds;
        const result = await deleteMedication(medication);
        if (result.success) {
            Alert.alert(
                'El Medicamento fue eliminado correctamente',
                '',
                [
                    {text: 'Ok', onPress: () => navigation.navigate('Medications', {session: session})}
                ]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    const {t, i18n} = useTranslation();

    function lowercaseFirstLetter(str: string) {
        if (!str) return str; // Handle empty strings or null
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    let str = t('medicine');
    str = lowercaseFirstLetter(str);

    let sinceD = new Date(route.params.meds.sinceWhen)
    let since = sinceD.toISOString().split('T')[0]

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                { i18n.language === 'english' ? (
                        <Text style={styles.titleText}>{t('medicine')} {t('text2')} </Text>
                    ) : (
                        <View>
                            <Text style={styles.titleText}>{t('text2')}</Text>
                            <Text style={styles.titleText}>{str}</Text>
                        </View>
                    )
                }
            </View>
            <View style={styles.addContainer}>
                <Icon
                    name='pencil'
                    iconStyle={{ color: '#1E3A1A' }}
                    type='ionicon'
                    size={25}
                    style={{margin: "5%"}}
                    onPress={() => navigation.navigate('EditMedication', {medication: route.params.meds})}
                />
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('medicine')}:</Text>
                <Text style={styles.value}>{route.params.meds.name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('prescription')}:</Text>
                <Text style={styles.value}>{route.params.meds.prescription}</Text>
            </View>
            {route.params.meds.sinceWhen  && (
                <View style={styles.detailRow}>
                    <Text style={styles.label}>{t('text22').slice(2, -2)}:</Text>
                    <Text style={styles.value}>{since}</Text>
                </View>
            )}
            {route.params.meds.howOften && (
                <View style={styles.detailRow}>
                    <Text style={styles.label}>{t('text23')}</Text>
                    <Text>{parseInt(route.params.meds.howOften.toString().split(':')[0], 10)}{t('text24')} </Text>
                </View>
            )}
            {route.params.meds.untilWhen && route.params.meds.isForever===false && (
                <View style={styles.detailRow}>
                    <Text style={styles.label}>{t('text21').slice(2, -2)}:</Text>
                    {route.params.meds.isForever===true && (
                        <View style={[styles.detailRow]}>
                            <Text style={styles.label}>{t('text21').slice(2, -2)}:</Text>
                            <Text style={styles.value}>{t('text25')}</Text>
                        </View>
                    )}
                    <Text style={styles.value}>{route.params.meds.untilWhen}</Text>
                </View>
            )}
            {route.params.meds.isForever===true && (
                <View style={[styles.detailRow]}>
                    <Text style={styles.label}>{t('text21').slice(2, -2)}:</Text>
                    <Text style={styles.value}>{t('text25')}</Text>
                </View>
            )}
            <View style={styles.screen}>
                <View style={{alignItems: 'center', width: 'auto'}}>
                    <Button
                        title={t('delete')}
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
                        onPress={() => showDialog()}
                    />
                </View>
            </View>
            <Dialog style={styles.dialog}
                    visible={visible}
                    onDismiss={hideDialog}>
                <Dialog.Content>
                    <Text style={[{textAlign: 'center'}, {fontSize: 18}]}>
                        {t('RUsureM')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        Cancelar
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteMedication}>
                        Eliminar
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default SingleMedication;

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
