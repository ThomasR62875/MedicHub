import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {Icon, Button} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Button as PaperButton, Dialog, TextInput} from "react-native-paper";
import {getUserIdByEmail, setDependentUser} from "../lib/supabase";

type SingleDependentUserProps = NativeStackScreenProps<RootStackParamList, 'SingleDependentUser'>


const SingleDependentUser: React.FC<SingleDependentUserProps> = ({navigation, route}: any) => {
    const [visible, setVisible] = React.useState(false);
    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);

    const [shareDialog, setShareDialog] = React.useState(false);
    const [shareEmail, setShareEmail] = React.useState("");
    const handleDeleteDependentUser = async () => {
        const session = route.params.session;
        navigation.navigate('Usuarios', {session: session})
    };

    const {t, i18n} = useTranslation();

    function lowercaseFirstLetter(str: string) {
        if (!str) return str; // Handle empty strings or null
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    let str = t('depu');
    str = lowercaseFirstLetter(str);

    const handleUserSharing = async () => {
        const parent_id = await getUserIdByEmail(shareEmail);
        if (parent_id === undefined) {
            console.log('Parent user not found');
            return;
        }

        const result = await setDependentUser(parent_id, route.params.du.id);
        if (result) {
            console.log('User sharing set successfully');
        } else {
            console.log('Failed to set user sharing');
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                {i18n.language === 'english' ? (
                    <Text style={styles.titleText}>{t('depu')} {t('text2')} </Text>
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
                    iconStyle={{color: '#1E3A1A'}}
                    type='ionicon'
                    size={25}
                    style={{margin: "5%"}}
                    onPress={() => navigation.navigate('EditDependentUser', {du: route.params.du})}
                />
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('name')}:</Text>
                <Text style={styles.value}>{route.params.du.first_name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('surname')}:</Text>
                <Text style={styles.value}>{route.params.du.last_name}</Text>
            </View>
            <View style={styles.detailRow}>
                <Text style={styles.label}>{t('id')}:</Text>
                <Text style={styles.value}>{route.params.du.dni}</Text>
            </View>
            <View style={styles.screen}>
                <View style={{alignItems: 'center', width: 'auto'}}>
                    {/*<PaperButton*/}
                    {/*    mode="outlined"*/}
                    {/*    style={styles.shareUserBotton}*/}
                    {/*    textColor='#2E5829'*/}
                    {/*    labelStyle={{ textAlign: 'left', display: 'flex' }}*/}
                    {/*    onPress={()=>()}*/}
                    {/*>{t('share_user')}</PaperButton>*/}
                    <PaperButton
                        mode="outlined"
                        style={styles.shareUserBotton}
                        textColor='#2E5829'
                        labelStyle={{textAlign: 'left', display: 'flex'}}
                        onPress={() => setShareDialog(true)}
                    >{t('share_user')}</PaperButton>
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
                            marginTop: 20,
                            marginBottom: 100
                        }}
                        titleStyle={{color: '#eef9ed'}}
                        onPress={() => showDialog()}
                    />
                </View>
            </View>
            <Dialog style={styles.dialog}
                    visible={visible}
                    onDismiss={hideDialog}>
                <Dialog.Content>
                    <Text style={[{textAlign: 'center'}, {fontSize: 18}]}>
                        {t('RUsureDU')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{justifyContent: 'center'}}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        {t('cancel')}
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={handleDeleteDependentUser}>
                        {t('delete')}
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
            <Dialog style={styles.dialog}
                    visible={shareDialog}
                    onDismiss={() => setShareDialog(false)}>
                <Dialog.Actions>
                    <View>
                        <Text>Ingrese el mail del usario con el que desea compartir</Text>
                        <TextInput
                            label="Email"
                            value={shareEmail}
                            mode={'outlined'}
                            style={styles.inputStyle}
                            onChangeText={text => setShareEmail(text)}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <PaperButton onPress={()=> setShareDialog(false)}>{t('cancel')}</PaperButton>
                            <PaperButton onPress={()=> handleUserSharing()}>{t('confirm')}</PaperButton>
                        </View>
                    </View>
                </Dialog.Actions>
            </Dialog>
        </View>
    );
};

export default SingleDependentUser;

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
    dialog: {
        backgroundColor: '#E9F4E9FF',
        alignItems: 'center',
    },
    shareUserBotton: {
        borderRadius: 6,
        margin: '5%',
        width: '60%'
    },
    inputStyle: {
        marginTop: '5%',
        marginBottom: '5%'
    }

});
