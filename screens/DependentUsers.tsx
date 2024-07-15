import React, { useState, useEffect } from 'react'
import { getAdvertisement, getDependentUsers} from '../lib/supabase'
import {View, Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import { Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import DependentUserButton from "../components/DependentUsertButton";
import { Advertisement, DependentUser, Doctor } from '../lib/types';
import {styles} from '../assets/styles'
// @ts-ignore
import Squiggle from "../assets/tabAsset.png";
import ScrollableBg from "../components/ScrollableBg";
import { SmallBanner } from '../components/SmallBanner';

const DependentUsers: React.FC = ({navigation, route} : any) => {
    const {session} = route.params;
    const [dependent_users,setDependentUsers]= useState<DependentUser[] | undefined>(undefined)
    const {t} = useTranslation();
    const colors = [ 'rgba(139,134,190,0.6)','rgba(222,176,189,0.6)','rgba(236,183,97,0.6)','rgba(203,214,144,0.6)']
    const [isLoading, setIsLoading] = useState(true);
    const [advertisement,setAdvertisement] = useState<Advertisement | undefined>()

    useEffect(() => {
        navigation.addListener('focus', () => {
            async function fetchData() {
                setDependentUsers(await getDependentUsers())
                setAdvertisement( await getAdvertisement('BIG'));
                setIsLoading(false)
            }  
            fetchData()
        });

    }, [navigation, session]);

return(
    <View style={styles.tab}>
        <Image source={Squiggle} style={styles.squiggle}/>
        <Text style={[styles.tabTitle]}>
            {t('depus')}
        </Text>
        <ScrollableBg >
            <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, margin: '5%', marginBottom: '2.5%'}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddDependentUser', {session: session})}
                >
                    <Text style={styles.buttonText}>{t('add')}</Text>
                </TouchableOpacity>
            </View>
            {isLoading ? (
                <ActivityIndicator size="small" color="#807d7d" style={{marginVertical: '10%'}}/>
            ) : (<View style={styles.listCards}>
                {dependent_users && dependent_users.length >0 ? (
                    dependent_users.map((d_user: DependentUser, i) => {
                        return (
                            <View key={i}>
                                <DependentUserButton onPress={() => navigation.navigate({name: 'SingleDependentUser', params: {du: d_user}})} du={d_user}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Icon iconStyle={{color: 'white'}} containerStyle={[styles.circleCard, {backgroundColor: colors[i%4]}]} name={'account'} type={'material-community'}/>
                                        <Text style={styles.cardText}>{d_user.first_name} {d_user.last_name}</Text>
                                    </View>
                                </DependentUserButton>
                            </View>
                        )
                    })) : (

                        <Text  style={[styles.text2,{alignSelf: 'center', padding: 30}]}>{t('text18')}</Text>

                )}
                <SmallBanner advertisement={advertisement} onPress={(doc:Doctor)=>navigation.navigate({name:'AddDoctor',params:{base_doctor:doc}})}/>
            </View>)}
        </ScrollableBg>
    </View>
)
}

export default DependentUsers;
