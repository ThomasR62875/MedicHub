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
import { Icon } from 'react-native-elements';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";
import { BannerProps } from '../lib/types';

export const ScreenBanner: React.FC<BannerProps> = (params:BannerProps)=>{
    const [visible,setVisible]= useState(params.visible);
    const {t} = useTranslation();
    const handleOnPress = async (advertisement:Advertisement) => {
        const doc:(Doctor| undefined) = await getClientDoctor(advertisement.client);
        params.onPress(doc);
    };
    return(
        <Modal visible={visible} onDismiss={() => setVisible(false)} animationType='fade'>
            {params.advertisement && (
                <View style={screenStyles.modalOverlay}>
                    <View style={screenStyles.closeButton}>
                        <TouchableOpacity  onPress={()=>setVisible(false)} >
                            <Icon name="close" size={40} color="white" type='ionicon' borderRadius={30} style={screenStyles.color}/>
                        </TouchableOpacity>
                    </View>
                    <View accessibilityRole='image' style={screenStyles.imageView}>
                        <Image source={{uri: params.advertisement.image_url}} style={screenStyles.imageStyle}/>
                        <View paddingTop='2%'>
                            <TouchableOpacity style={[styles.addButton,screenStyles.ownButton,screenStyles.color]} onPress={()=>{handleOnPress(params.advertisement)}}>
                                <Text style={[styles.buttonText,{fontSize:16}]}>{t('addoctor')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>)}
        </Modal>
    );
}

const screenStyles={
    color:{
        backgroundColor:'#86abba',
    },
    modalOverlay: {
        flex: 1,
    },
    closeButton: {
        flexDirection:'row', 
        justifyContent: 'start',
        alingItems:'left',
        paddingTop:'20%',
        paddingLeft:'5%'
    },
    
    imageStyle: {
        height: '80%',
        width: '90%',
        resizeMode:'cover',
        borderRadius:50,
    },

    imageView:{
        justifyContent: 'center',
        alignItems: 'center',
    },

    ownButton:{
        activeOpacity: 0.9,
        height: 50,
        width: 200,
    }
}