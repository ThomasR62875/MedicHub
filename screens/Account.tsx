import React, {useState, useEffect} from 'react'
import {getUser, getUserId, supabase} from '../lib/supabase'
import { View} from 'react-native'
import {Button, Icon} from 'react-native-elements'
import LanguageButton from '../components/LanguageButton'
import {DependentUser} from "../lib/types";
import {Dialog, Text, Button as PaperButton, Divider} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {styles} from "../assets/styles";


const Account: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [dni, setDni] = useState(0);
    const [date, setDate] = useState<Date>();
    const [sexGender,setSexGender]= useState('');
    const [visible, setVisible] = React.useState(false);
    const {t} = useTranslation();


    useEffect(() => {
        navigation.addListener('focus', () => {
            if (session) {
                async function fetchData() {
                    const data: DependentUser = await getUser(await getUserId())
                    setFirstName(data.first_name)
                    setLastName(data.last_name)
                    if (data.birthdate) {
                        const birthdate = new Date(data.birthdate);
                        setDate(birthdate);
                    } else {
                        setDate(undefined);
                    }
                    setSexGender(data.sex)
                    const dniString = String(data.dni);
                    if (dniString && dniString.length >= 8) {
                        const dniNumber = parseInt(dniString.slice(0, 8), 10);
                        setDni(dniNumber);
                    } else {
                        console.error('El DNI no es una cadena válida o no tiene al menos 8 caracteres.');
                    }
                }

                fetchData()
            }
        });

    }, [navigation, session]);


    const hideDialog = () => setVisible(false);
    const showDialog = () => setVisible(true);

    // @ts-ignore
    return (
        <View style={{flex: 1, backgroundColor: '#fff', marginBottom: 0}}>
            <View
                style={[{
                        width: 500,
                        height: 500,
                        borderRadius: 250,
                        left: 50,
                        top: -250,
                        backgroundColor: 'rgba(203,214,144,0.2)',
                        position: 'absolute',
                    },]}/>
            <View
                style={[{
                        width: 400,
                        height: 400,
                        borderRadius: 200,
                        left: -150,
                        top: -200,
                        backgroundColor: 'rgba(203,214,144,0.2)',
                        position: 'absolute',
                    },]}/>
            <Text style={[styles.tabTitle, {paddingLeft: 40}]}>
                {t('account')}
            </Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Icon
                        name='person-circle-outline'
                        iconStyle={{color: '#000', alignSelf: 'flex-start', paddingHorizontal: 40, paddingVertical: 25}}
                        type='ionicon'
                        size={100}
                    />
                    <Icon
                        name='pencil'
                        iconStyle={{color: '#807d7d'}}
                        type='ionicon'
                        size={25}
                        style={{margin: "5%"}}
                        onPress={() => navigation.navigate('EditAccount', {session: session})}
                    />
                    <View style={{marginLeft: '5%', alignSelf: 'center'}}>
                        <LanguageButton/>
                    </View>
                </View>
                <View style={{marginHorizontal: '12%', padding: 0, flexDirection: 'row'}}>
                    <Text style={styles.text}>{first_name} </Text>
                    <Text style={styles.text}>{last_name}</Text>
                </View>
                <Divider style={styles.divider}/>
                <View style={{marginVertical: '5%', marginHorizontal: '12%'}}>
                    <Text style={styles.title}>Mail:</Text>
                    <Text style={styles.text2}>{session?.user.email}</Text>
                    <View style={{marginTop: 5}}/>
                    <Text style={styles.title}>{t('id')}:</Text>
                    <Text style={styles.text2}>{dni}</Text>
                    <Text style={styles.title}>{t('birthdate')}:</Text>
                    <Text style={styles.text2}>{date ? date.toISOString().split('T')[0] : ' '}</Text>
                    <Text style={styles.title}>{t('sex')}:</Text>
                    <Text style={styles.text2}>{t(sexGender)}</Text>
                </View>
                <View style={{alignItems: 'center', width: 'auto', alignSelf: 'center'}}>
                    <Button
                        title={t('logout')}
                        buttonStyle={{
                            backgroundColor: '#ecb761',
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
                        titleStyle={{color: '#ffffff', fontWeight: 'bold', fontSize: 16}}
                        onPress={() => showDialog()}/>
                </View>
            <Dialog style={{backgroundColor: '#fff'}}
                    visible={visible}
                    onDismiss={hideDialog}>
                <Dialog.Content>
                    <Text variant="bodyMedium" style={[{textAlign: 'center'}, {fontSize: 18}]}>
                        {t('confirm_logout_message')}
                    </Text>
                </Dialog.Content>
                <Dialog.Actions style={{justifyContent: 'space-between'}}>
                    <PaperButton textColor="#2E5829FF"
                                 onPress={hideDialog}>
                        {t('cancel')}
                    </PaperButton>
                    <PaperButton textColor="#b6265d"
                                 onPress={() => supabase.auth.signOut()}>
                        {t('logout')}
                    </PaperButton>
                </Dialog.Actions>
            </Dialog>
        </View>
    )
}


export default Account
