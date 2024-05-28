import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog} from "react-native-paper";
import {deleteDependentUser, deleteDoctor} from "../lib/supabase";


type SingleDoctorProps = NativeStackScreenProps<RootStackParamList, 'SingleDoctor'>


const SingleDoctor: React.FC<SingleDoctorProps> = ({ navigation, route }: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
    const {t} = useTranslation();

    const handleDeleteDoctor = async () => {
        const session =  route.params.session;
        const doctor =  route.params.doc;
        const result = await deleteDoctor(doctor);
        navigation.navigate('Doctors', { session: session })
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>{t('text3')}</Text>
            </View>
            <View style={styles.addContainer}>
                <Icon
                    name='pencil'
                    iconStyle={{ color: '#1E3A1AFF' }}
                    type='ionicon'
                    size={25}
                    style={{margin: "10%"}}
                    onPress={() => navigation.navigate('EditDoctor', {doc: route.params.doc})}
                />
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('doc')}:</Text>
                <Text style={styles.value}>{route.params.doc.name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('specialty')}:</Text>
                <Text style={styles.value}>{route.params.doc.specialty}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>Mail:</Text>
                <Text style={styles.value}>{route.params.doc.email}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('phone')}:</Text>
                <Text style={styles.value}>{route.params.doc.phone}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('address')}:</Text>
                <Text style={styles.value}>{route.params.doc.addresses}</Text>
            </View>
            <View style={styles.screen}>
                <View style={{alignItems: 'center', width: 'auto'}}>
                    <Button
                        title="Eliminar"
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
                        {t('RUsureD')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        Cancelar
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteDoctor}>
                        Eliminar
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default SingleDoctor;

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
