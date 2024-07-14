import React from 'react';
import {View, Text, Alert} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import {deleteMedication} from "../lib/supabase";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Divider} from "react-native-paper";
import {styles} from "../assets/styles";
// @ts-ignore
import ScrollableBg from "../components/ScrollableBg";

type SingleMedicationProps = NativeStackScreenProps<RootStackParamList, 'SingleMedication'>


const SingleMedication: React.FC<SingleMedicationProps> = ({navigation, route}: any) => {
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

    const {t} = useTranslation();

    function lowercaseFirstLetter(str: string) {
        if (!str) return str; // Handle empty strings or null
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    let str = t('medicine');
    lowercaseFirstLetter(str);

    let sinceD = new Date(route.params.meds.sinceWhen)
    let since = sinceD.toISOString().split('T')[0]

    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(222,176,189,0.6)'}]}>
                <View style={{
                    flexDirection: 'row',
                    marginHorizontal: '10%',
                    marginVertical: '20%',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'}
                          style={styles.back_arrow}
                          onPress={() => navigation.navigate('Medications')}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {
                        backgroundColor: 'rgba(222,176,189,0.6)',
                        alignSelf: 'center'
                    }]} name={'pill'} type={'material-community'}/>
                    <Icon
                        name='pencil'
                        iconStyle={{color: '#fff'}}
                        type='ionicon'
                        size={25}
                        onPress={() => navigation.navigate('EditMedication', {medication: route.params.meds})}
                    />
                </View>
            </View>
            <ScrollableBg>
                <Text style={styles.titleText}>{route.params.meds.name}</Text>
                <Divider style={styles.divider}></Divider>
                <View style={{padding: '10%'}}>

                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('prescription')}:</Text>
                        <Text style={styles.value}>{route.params.meds.prescription}</Text>
                    </View>
                    {route.params.meds.sinceWhen && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>{t('text22')}:</Text>
                            <Text style={styles.value}>{since}</Text>
                        </View>
                    )}
                    {route.params.meds.untilWhen && route.params.meds.isForever === false && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>{t('text21')}:</Text>
                            {route.params.meds.isForever === true && (
                                <View style={[styles.detailRow]}>
                                    <Text style={styles.label}>{t('text21').slice(2, -2)}:</Text>
                                    <Text style={styles.value}>{t('text25')}</Text>
                                </View>
                            )}
                            <Text style={styles.value}>{(new Date(route.params.meds.untilWhen)).toLocaleDateString()}</Text>
                        </View>
                    )}
                    {route.params.meds.howOften && (
                        <View style={styles.detailRow}>
                            <Text style={styles.label}>{t('text23')}</Text>
                            <Text
                                style={styles.value}>{parseInt(route.params.meds.howOften.toString().split(':')[0], 10)}{t('text24')} </Text>
                        </View>
                    )}
                    {route.params.meds.isForever === true && (
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
                                    backgroundColor: '#deb0bd',
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
                                    marginBottom: 100
                                }}
                                titleStyle={{color: '#fff'}}
                                onPress={() => showDialog()}
                            />
                        </View>
                    </View>
                </View>
            </ScrollableBg>

            <Dialog style={styles.dialog}
                    visible={visible}
                    onDismiss={hideDialog}>
                <Dialog.Content>
                    <Text style={[{textAlign: 'center'}, {fontSize: 18}]}>
                        {t('RUsureM')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{justifyContent: 'space-between'}}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        {t('cancel')}
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteMedication}>
                        {t('delete')}
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>

    );
};

export default SingleMedication;
