import React, { useEffect, useState } from 'react';
import {
    Text,
    Image,
    Pressable,
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    ProgressBarAndroidComponent
} from 'react-native';
import { Advertisement, BannerProps } from '../lib/types';
import { Icon } from 'react-native-elements';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";

export const BigBanner: React.FC<BannerProps>= (params:BannerProps) => {
    const [visible,setVisible]= useState(params.visible);
    const {t} = useTranslation();

    return(
        <View>
            {params.advertisement && (
                <View style={bigStyles.container}>
                    <Image source={{uri: params.advertisement.image_url}} style={bigStyles.imageStyle} />
                    <View style={[{width:'100%'}]}>
                        <TouchableOpacity style={[bigStyles.button,bigStyles.color]}>
                            <Text style={[styles.buttonText,{fontSize:16,justifyContent:'center',textAlign:'center'}]}>{t('addoctor')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const bigStyles={
    color:{
        backgroundColor:'#86abba',
    },
    imageStyle: {
        height: 250,
        width: '100%',
        resizeMode:'stretch',
        borderRadius:20,
        padding:0,
        margin:0
    },

    container:{
        alignItems:'center',
        borderWidth:5,
        borderColor: '#86abba',
        borderRadius:25
    },

    button:{
        alingItems:'center',        
        justifyContent: 'center',
        borderBottomRightRadius:20,
        borderBottomLeftRadius:20,
    }
}