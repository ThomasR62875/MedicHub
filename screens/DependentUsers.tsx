import React, { useState, useEffect } from 'react'
import { getDependentUsers} from '../lib/supabase'
import {View,  Text, Dimensions, Image, TouchableOpacity} from 'react-native'
import { Icon} from "react-native-elements";
import {useTranslation} from "react-i18next";
import {cardStyle} from "../styles/global"
import DependentUserButton from "../components/DependentUsertButton";
import { DependentUser } from '../lib/types';
import {styles} from '../assets/styles'
// @ts-ignore
import Squiggle from "../assets/tabAsset.png";
import ScrollableBg from "../components/ScrollableBg";

const DependentUsers: React.FC = ({navigation, route} : any) => {
    const {session} = route.params;
    const [dependent_users,setDependentUsers]= useState<DependentUser[] | undefined>(undefined)
    const {t} = useTranslation();
    const colors = [ 'rgba(139,134,190,0.6)','rgba(222,176,189,0.6)','rgba(236,183,97,0.6)','rgba(203,214,144,0.6)']

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            async function fetchData() {
                setDependentUsers(await getDependentUsers(session.id))
            }  
            fetchData()
        });

        return unsubscribe;
    }, [navigation, session]);

return(
    <View style={styles.tab}>
        <Image source={Squiggle} style={styles.squiggle}/>
        <Text style={[styles.tabTitle]}>
            {t('depus')}
        </Text>
        <ScrollableBg>
            <View style={{flexDirection: 'row', justifyContent: 'space-between',flex:0, margin: '5%', marginBottom: '2.5%'}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddDependentUser', {session: session})}
                >
                    <Text style={styles.buttonText}>{t('add')}</Text>
                </TouchableOpacity>
                <Icon name={'filter-variant'} type={'material-community'} color={'#000000'} size={30} style={{paddingRight: 20, padding: 5}} onPress={() => console.log('Filter')}/>
            </View>
            <View style={styles.listCards}>
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
                    <View style={[cardStyle.container]}>
                        <Text style={styles.text}>{t('text18')}</Text>
                    </View>
                )}
            </View>
        </ScrollableBg>
    </View>
    // <View style={styles.container}>
    //     <View style={styles.window}>
    //         <View style={styles.topContent}>
    //             <Text style={styles.titleText}>{t('depu')}</Text>
    //             <Button
    //                 title={t('add')}
    //                 buttonStyle={{
    //                     backgroundColor: '#2E5829',
    //                     borderColor: 'white',
    //                     borderRadius: 20,
    //                     minHeight: 10,
    //                     minWidth: 10,
    //                 }}
    //                 titleStyle={{ color: '#E9F4E9FF',fontSize: 15, margin: 5 }}
    //                 onPress={() => navigation.navigate('AddDependentUser', {session: session})}/>
    //         </View>
    //         <ScrollView style={{width:'90%', marginTop: percentageMargin }}>
    //             {dependent_users && dependent_users.length >0 ? (
    //                 dependent_users.map((d_user: DependentUser, i) => {
    //                 return (
    //                     <View key={i}>
    //                         <DependentUserButton onPress={() => navigation.navigate({name: 'SingleDependentUser', params: {du: d_user}})} du={d_user}></DependentUserButton>
    //                     </View>
    //                 )
    //             })) : (
    //                 <View style={[cardStyle.container]}>
    //                     <Text style={styles.text}>{t('text18')}</Text>
    //                 </View>
    //             )}
    //         </ScrollView>
    //     </View>
    // </View>
)
}

export default DependentUsers;
//
// const styles = StyleSheet.create({
//     container: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: "#e9f4e9",
//     },
//     duserContainer: {
//         marginTop: '5%',
//         alignItems: 'center',
//         borderRadius: 5,
//     },
//     titleText: {
//         fontFamily: 'Roboto-Thin',
//         fontSize: 25,
//         textAlign: 'left',
//         fontWeight: 'bold',
//         marginTop: "1%",
//         color: "#2E5829FF",
//         width: "70%"
//     },
//     text: {
//         fontSize: 20,
//         textAlign: 'center',
//         justifyContent: 'center',
//         margin: '5%',
//         color: "#215a1b"
//     },
//     window: {
//         marginTop: "25%",
//         marginLeft: "5%",
//         marginRight: "5%",
//     },
//     topContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//     }
//
// });