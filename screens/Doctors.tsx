import React, {useState, useEffect} from 'react'
import {getDoctors, getAdvertisement} from '../lib/supabase'
import { View, Text, Image, TouchableOpacity} from 'react-native'
import { Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import DoctorButton from "../components/DoctorButton";
import {Advertisement, Doctor} from '../lib/types';
import {styles} from "../assets/styles";
// @ts-ignore
import Squiggle from "../assets/squiggle_pink.png";
import ScrollableBg from "../components/ScrollableBg";
import {SmallBanner} from "../components/SmallBanner"

const Doctors: React.FC = ({navigation, route}: any) => {
    const {session} = route.params;
    const [doctors, setDoctors] = useState<Doctor[] | undefined>(undefined)
    const [advertisement,setAdvertisement] = useState<Advertisement | undefined>()
    const {t} = useTranslation();
    const colors = [ 'rgba(139,134,190,0.6)','rgba(222,176,189,0.6)','rgba(236,183,97,0.6)','rgba(203,214,144,0.6)']


    useEffect(() => {
        navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setDoctors(await getDoctors());
                    setAdvertisement( await getAdvertisement('BIG'));
                }
            }

            fetchData();
        });

    }, [navigation, session]);

    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle_left}/>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, marginTop: '15%', marginHorizontal: '5%'}}>
                <Icon name={'arrow-left'} type={'material-community'} style={styles.back_arrow} onPress={() => navigation.navigate('HomeTabs')}></Icon>
            </View>
            <Text style={[styles.stackTitle]}>
                {t('doctors')}
            </Text>
            <ScrollableBg>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, margin: '5%', marginBottom: '2.5%'}}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddDoctor', {session: session})}
                    >
                        <Text style={styles.buttonText}>{t('add')}</Text>
                    </TouchableOpacity>
                    <Icon name={'filter-variant'} type={'material-community'} color={'#000000'} size={30} style={{paddingRight: 20, padding: 5}} onPress={() => console.log('Filter')}/>
                </View>
                <View style={styles.listCards}>
                    {doctors && doctors?.length > 0  ? (
                        doctors.map((doc: Doctor, i) => {
                            return (
                                <View key={i}>
                                    <DoctorButton onPress={() => navigation.navigate({name: 'SingleDoctor', params: {doc: doc}})}>
                                        <View style={{flexDirection: 'row'}}>
                                            <Icon iconStyle={{color: 'white', fontSize: 16, padding: 5}} containerStyle={[styles.circleCard, {backgroundColor: colors[i%4]}]} name={'stethoscope'} type={'material-community'}/>
                                            <View style={{flexDirection: 'column', paddingHorizontal: 14}}>
                                                <Text style={[{fontSize: 14, paddingVertical: 7}]}>{doc.name}</Text>
                                                <Text style={[styles.text2, {fontSize: 12, width: '150%', paddingBottom: 5}]}>{t(doc.specialty)}</Text>
                                            </View>
                                        </View>
                                    </DoctorButton>
                                </View>
                            )
                        })
                    ) : (
                        <Text style={[styles.text2,{alignSelf: 'center', padding: 30}]}>{t('text17')}</Text>
                    )
                    }
                    <SmallBanner advertisement={advertisement} onPress={(doc:Doctor)=>navigation.navigate({name:'AddDoctor',params:{base_doctor:doc}})}/>
                </View>
            </ScrollableBg>
        </View>
    )
}

export default Doctors;
