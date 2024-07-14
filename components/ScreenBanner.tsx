import React, { useState } from 'react';
import {
    Text,
    Image,
    StyleSheet,
    View,
    TouchableOpacity,
    Modal
} from 'react-native';
import { Icon } from 'react-native-elements';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";
import { BannerProps, Doctor, Advertisement} from '../lib/types';
import { getClientDoctor } from '../lib/supabase';

interface ScreenBannerProps extends BannerProps{
    onDismiss: (()=>void);
}

export const ScreenBanner: React.FC<ScreenBannerProps> = (params:ScreenBannerProps)=>{
    const [visible,setVisible]= useState(params.visible);
    const {t} = useTranslation();
    const handleOnPress = async (advertisement:Advertisement) => {
        const doc:(Doctor| undefined) = await getClientDoctor(advertisement.client);
        params.onPress(doc);
    };

    useEffect(()=>{
        setVisible(params.visible);
    },[params.visible])
    
    const handleOnDismiss= ()=>{
        if(params.onDismiss != undefined) {
            params.onDismiss();
        }
        setVisible(false);
        
    }
    return(
        <Modal visible={visible} animationType='fade'>
                <View style={screenStyles.modalOverlay}>
                    <View style={screenStyles.closeButton}>
                        <TouchableOpacity  onPress={()=>{handleOnDismiss()}} >
                            <Icon name="close" size={40} color="white" type='ionicon' borderRadius={30} style={screenStyles.color}/>
                        </TouchableOpacity>
                    </View>
                    {params.advertisement &&(
                        <View accessibilityRole='image' style={screenStyles.imageView}>
                            <Image source={{uri: params.advertisement.image_url}} style={screenStyles.imageStyle}/>
                            <View >
                                <TouchableOpacity style={[styles.addButton,screenStyles.ownButton,screenStyles.color]} onPress={()=>{handleOnPress(params.advertisement)}}>
                                    <Text style={[styles.buttonText,{fontSize:16}]}>{t('addoctor')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                )}
                </View>
        </Modal>
    );
}

const screenStyles= StyleSheet.create({
    color:{
        backgroundColor:'#86abba',
    },
    modalOverlay: {
        flex: 1,
    },
    closeButton: {
        flexDirection:'row', 
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop:'20%',
        paddingLeft:'5%'
    },
    
    imageStyle: {
        height: '65%',
        width: '80%',
        resizeMode:'cover',
        borderRadius:50,
    },

    imageView:{
        justifyContent: 'center',
        alignItems: 'center',
    },

    ownButton:{
        height: '23%',
        width: '150%',
        margin: '5%'
    }
})