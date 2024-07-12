import React from 'react';
import { View, Text, Image} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Divider} from "react-native-paper";
import { deleteDoctor} from "../lib/supabase";
import {styles} from "../assets/styles";
// @ts-ignore
import Header from "../assets/header_blue.png";
import ScrollableBg from "../components/ScrollableBg";


type SingleDoctorProps = NativeStackScreenProps<RootStackParamList, 'SingleDoctor'>


const SingleDoctor: React.FC<SingleDoctorProps> = ({navigation, route}: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
    const {t} = useTranslation();

    const handleDeleteDoctor = async () => {
        const session = route.params.session;
        const doctor = route.params.doc;
        await deleteDoctor(doctor);
        navigation.navigate('Doctors', {session: session})
    };

    return (
        <View style={styles.tab}>
            <Image source={Header} style={styles.header}/>

            <Icon iconStyle={{color: 'white', paddingVertical: 20}} name={'arrow-left'} type={'material-community'}
                  style={styles.back_arrow}
                  onPress={() => navigation.navigate('HomeTabs')}></Icon>
            <View style={{
                flexDirection: 'row',
                paddingTop: '5%',
                marginLeft: '10%',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon iconStyle={{color: 'white', fontSize: 24}} containerStyle={[styles.circleHeader, {
                    backgroundColor: 'rgba(134,171,186,0.6)',
                    alignSelf: 'center',
                    marginHorizontal: "10%"
                }]} name={'stethoscope'} type={'material-community'}/>
                <Icon
                    name='pencil'
                    iconStyle={{color: '#fff', paddingLeft: 20, paddingBottom: 25}}
                    type='ionicon'
                    size={25}
                    onPress={() => navigation.navigate('EditDoctor', {doc: route.params.doc})}
                />
            </View>
            <ScrollableBg>
                <Text style={styles.titleText}>{route.params.doc.name}</Text>
                <Divider style={styles.divider}></Divider>

                <View style={{padding: '10%'}}>
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
                                    backgroundColor: '#86ABBA',
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
                        {t('RUsureD')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{justifyContent: 'space-between'}}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        {t('cancel')}
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteDoctor}>
                        {t('delete')}
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>

    );
};

export default SingleDoctor;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#e9f4e9',
//     },
//     titleContainer: {
//         fontSize: 25,
//         fontWeight: 'bold',
//         marginTop: 10,
//         alignSelf: 'center',
//         marginBottom: 20,
//     },
//     titleText: {
//         fontSize: 25,
//         textAlign: 'center',
//         justifyContent: 'center',
//         fontWeight: 'bold',
//     },
//     detailRow: {
//         flexDirection: 'row',
//         marginBottom: 10,
//     },
//     label: {
//         fontWeight: 'bold',
//         marginRight: 5,
//     },
//     value: {
//         flex: 1,
//     },
//     addContainer: {
//         left: 290,
//         bottom: 60,
//         alignSelf: 'flex-start',
//     },
//     screen: {
//         backgroundColor: "#E9F4E9FF",
//         height: "100%",
//     },
//     dialog:{
//         backgroundColor: '#E9F4E9FF',
//
//     }
// });
