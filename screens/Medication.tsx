import React, {useState, useEffect} from 'react'
import {View, Text, Image, TouchableOpacity} from 'react-native'
import {getMedications} from '../lib/supabase'
import MedicationButton from "../components/MedicationButton";
import {Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {Medication} from '../lib/types';
import {styles} from "../assets/styles";
// @ts-ignore
import Squiggle from "../assets/squiggle_pink.png";
import ScrollableBg from "../components/ScrollableBg";

const Medications: React.FC = ({navigation, route}: any) => {
    const session = route.params.session;
    const [medications, setMedications] = useState<Medication[] | undefined>(undefined)
    const {t} = useTranslation();
    const colors = ['rgba(139,134,190,0.6)', 'rgba(222,176,189,0.6)', 'rgba(236,183,97,0.6)', 'rgba(203,214,144,0.6)']

    useEffect(() => {
        navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setMedications(await getMedications());
                }
            }

            fetchData();
        });
    }, [navigation, session]);


    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle_left}/>
            <Icon name={'arrow-left'} type={'material-community'} style={styles.back_arrow}
                  onPress={() => navigation.navigate('HomeTabs')}></Icon>
            <Text style={[styles.stackTitle]}>
                {t('medicine')}
            </Text>
            <ScrollableBg>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flex: 0,
                    margin: '5%',
                    marginBottom: '2.5%'
                }}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation.navigate('AddMedication', {session: session})}
                    >
                        <Text style={styles.buttonText}>{t('add')}</Text>
                    </TouchableOpacity>
                    <Icon name={'filter-variant'} type={'material-community'} color={'#000000'} size={30}
                          style={{paddingRight: 20, padding: 5}} onPress={() => console.log('Filter')}/>
                </View>
                <View style={styles.listCards}>
                    {
                        medications && medications.length > 0 ? (
                            medications.map((medic: Medication, i) => {
                                return (
                                    <View key={i}>
                                        <MedicationButton onPress={() => navigation.navigate({
                                            name: 'SingleMedication',
                                            params: {meds: medic}
                                        })}>
                                            <View style={{flexDirection: 'row'}}>
                                                <Icon iconStyle={{color: 'white', fontSize: 16, padding: 5}}
                                                      containerStyle={[styles.circleCard, {backgroundColor: colors[i % 4]}]}
                                                      name={'pill'} type={'material-community'}/>
                                                <View style={{flexDirection: 'column', paddingHorizontal: 14}}>
                                                    <Text
                                                        style={[{fontSize: 14, paddingVertical: 7}]}>{medic.name}</Text>
                                                    <Text style={[styles.text2, {
                                                        fontSize: 12,
                                                        width: '150%',
                                                        paddingBottom: 5
                                                    }]}>{medic.prescription}{medic.howOften != null ? ', ' + t('every') + ' ' + parseInt(medic.howOften.toString().split(':')[0], 10) + t('text24') : ''}</Text>
                                                </View>
                                            </View>


                                        </MedicationButton>
                                    </View>
                                )
                            })
                        ) : (
                            <Text style={[styles.text2, {alignSelf: 'center', padding: 30}]}>{t('text16')}</Text>
                        )
                    }
                </View>
            </ScrollableBg>
        </View>
    )
}

export default Medications;