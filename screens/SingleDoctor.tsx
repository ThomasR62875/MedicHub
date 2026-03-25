import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Button, Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, Divider} from "react-native-paper";
import {deleteDoctor, getUser} from "../lib/supabase";
import {styles} from "../assets/styles";
// @ts-ignore
import Header from "../assets/header_blue.png";
import ScrollableBg from "../components/ScrollableBg";
import {DependentUser} from "../lib/types";


type SingleDoctorProps = NativeStackScreenProps<RootStackParamList, 'SingleDoctor'>


const SingleDoctor: React.FC<SingleDoctorProps> = ({navigation, route}: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);
    const {t} = useTranslation();
    const [user, setUser] = React.useState<DependentUser | undefined>(undefined);

    useEffect(() => {
        async function fetchData() {
            setUser(await getUser(route.params.doc.user_id))
        }

        fetchData()
    }, [route.params.doc]);

    const handleDeleteDoctor = async () => {
        const session = route.params.session;
        const doctor = route.params.doc;
        await deleteDoctor(doctor.id);
        navigation.navigate('Doctors', {session: session})
    };


    return (
        <View style={styles.tab}>
            <View style={[styles.header, {backgroundColor: 'rgba(134,171,186,0.6)', alignItems: 'center', paddingBottom: '15%'}]}>
                <View style={{marginTop: '25%'}}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '70%'
                    }}>
                            <Icon iconStyle={{color: 'white'}} name={'arrow-left'} type={'material-community'}
                                  style={{paddingVertical: '15%'}}
                                  onPress={() => navigation.navigate('Doctors')}></Icon>
                            <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {
                                backgroundColor: 'rgba(134,171,186,0.6)',
                                alignSelf: 'center'
                            }]} name={'stethoscope'} type={'material-community'}/>
                            <Icon
                                name='pencil'
                                iconStyle={{color: '#fff'}}
                                type='ionicon'
                                size={25}
                                onPress={() => navigation.navigate('EditDoctor', {doc: route.params.doc})}
                            />

                    </View>
                </View>
            </View>

            <ScrollableBg>
                <Text style={styles.titleText}>{route.params.doc.name}</Text>
                <Divider style={styles.divider}></Divider>

                <View style={{padding: '10%'}}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('specialty')}:</Text>
                        <Text style={styles.value}>{t(route.params.doc.specialty)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('email')}:</Text>
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
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>{t('user')}:</Text>
                        <Text style={styles.value}>{user?.first_name}</Text>
                    </View>
                    <View style={styles.screen}>
                        <View style={{alignItems: 'center', width: 'auto'}}>
                            <Button
                                title={t('delete')}
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