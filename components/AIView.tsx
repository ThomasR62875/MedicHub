import React, { useEffect, useState } from 'react';
import {
    Text,
    Image,
    Pressable,
    StyleSheet,
    View,
    TouchableOpacity,
    Modal
} from 'react-native';
import { Divider, Icon } from 'react-native-elements';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";
import ScrollableBg from "../components/ScrollableBg";
interface AIViewProps {
    visible:boolean;
    onDismiss: (()=>void);
    recommendation: string;
}

export const AIView: React.FC<AIViewProps> = (params:AIViewProps) => {
    const [visibleAI,setVisibleAI] = useState(params.visible);
    const [recommendation,setRecommendation] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const {t} = useTranslation();

    useEffect(()=>{
        setVisibleAI(params.visible);
        setDisplayedText('');
    },[params.visible])
    
    useEffect(()=>{
        if(params.recommendation != undefined){
            setRecommendation(params.recommendation);
        }
    },[params.recommendation]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
          setDisplayedText((prev) => prev + recommendation[index]);
          index++;
          if (index === recommendation.length) {
            clearInterval(intervalId);
          }
        }, 17); // Adjust the speed of typing by changing the interval time
    
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
      }, [params.visible]);

    return (
        <Modal visible={visibleAI} animationType='fade'>
            <View style={[styles.header, {backgroundColor: 'rgba(134,171,186,0.6)',height:'20%'}]}>
                <View style={{flexDirection: 'row', marginHorizontal:'10%', marginVertical:'20%', alignItems: 'center', justifyContent: 'space-between'}}>
                    <Icon iconStyle={{color: 'white'}} name={'close'} type={'material-community'} style={styles.back_arrow}
                          onPress={() => {params.onDismiss()}}></Icon>
                    <Icon iconStyle={{color: 'white', fontSize: 20}} containerStyle={[styles.circleHeader, {backgroundColor: 'rgba(134,171,186,0.6)', alignSelf: 'center'}]} name={'robot-outline'} type={'material-community'}/>
                </View>
            </View>
            <ScrollableBg>
                <Text style={styles.titleText}>{t('ia_title')}</Text>
                <Divider style={styles.divider}></Divider>

                <View style={{padding: '10%'}}>
                    <Text style={[styles.text5,{lineHeight:25}]}>{displayedText}</Text>
                </View>
            </ScrollableBg>

        </Modal>
    );
}