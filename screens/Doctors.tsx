import React, {useState, useEffect} from 'react'
import {getDoctors} from '../lib/supabase'
import { View, Text, Image, TouchableOpacity} from 'react-native'
import { Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"
import DoctorButton from "../components/DoctorButton";
import {Doctor} from '../lib/types';
import {styles} from "../assets/styles";
// @ts-ignore
import Squiggle from "../assets/squiggle_pink.png";
import ScrollableBg from "../components/ScrollableBg";


const Doctors: React.FC = ({navigation, route}: any) => {
    const {session} = route.params;
    const [doctors, setDoctors] = useState<Doctor[] | undefined>(undefined)
    const {t} = useTranslation();
    const colors = [ 'rgba(139,134,190,0.6)','rgba(222,176,189,0.6)','rgba(236,183,97,0.6)','rgba(203,214,144,0.6)']


    useEffect(() => {
        navigation.addListener('focus', () => {
            async function fetchData() {
                if (session) {
                    setDoctors(await getDoctors());
                }
            }

            fetchData();
        });

    }, [navigation, session]);

    return (
        <View style={styles.tab}>
            <Image source={Squiggle} style={styles.squiggle_left}/>
            <Icon name={'arrow-left'} type={'material-community'} style={styles.back_arrow} onPress={() => navigation.navigate('HomeTabs')}></Icon>
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
                                                <Text style={[styles.text2, {fontSize: 12, width: '150%', paddingBottom: 5}]}>{doc.specialty}</Text>
                                            </View>
                                        </View>
                                    </DoctorButton>
                                </View>
                            )
                        })
                    ) : (
                        <View style={[cardStyle.container]}>
                            <Text style={styles.text}>{t('text17')}</Text>
                        </View>
                    )
                    }
                </View>
            </ScrollableBg>
        </View>
        // <View style={styles.container}>
        //     <View style={styles.window}>
        //         <View style={styles.topContent}>
        //             <Text style={styles.titleText}>{t('doc')}</Text>
        //             <Button
        //                 title={t('add')}
        //                 buttonStyle={{
        //                     backgroundColor: '#2E5829',
        //                     borderColor: 'white',
        //                     borderRadius: 20,
        //                     minHeight: 10,
        //                     minWidth: 10,
        //                 }}
        //                 titleStyle={{ color: '#E9F4E9',fontSize: 15, margin: 5 }}
        //                 onPress={() => navigation.navigate('AddDoctor', {session: session})}/>
        //         </View>
        //     <ScrollView>

        //     </ScrollView>
        //     </View>
        // </View>
    )
}

export default Doctors;
//
// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: "#e9f4e9",
//       },
//
//     titleText: {
//         fontFamily: 'Roboto-Thin',
//         fontSize: 25,
//         textAlign: 'left',
//         fontWeight: 'bold',
//         marginTop: "1%",
//         color: "#2E5829FF",
//         width: "70%"
//     },
//     window: {
//         marginTop: "20%",
//         marginLeft: "5%",
//         marginRight: "5%",
//     },
//     topContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: "5%",
//
//     },
//     text: {
//         fontFamily: 'Roboto-Thin',
//         fontSize: 14,
//         marginTop: "1%",
//         color: "#2E5829FF",
//         width: "60%"
//     }
// });
