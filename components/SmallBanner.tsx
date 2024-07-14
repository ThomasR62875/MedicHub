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

export const SmallBanner: React.FC<BannerProps> = (params:BannerProps)=>{
    const {t} = useTranslation();
    return (
        <View>
            {params.advertisement && (
                <View style={[styles.cards,{flexDirection: 'row',borderColor:'#86abba',borderWidth:3}]}>
                    <Image source={{uri: params.advertisement.image_url}} style={smallStyles.imageStyle}/>
                    <View style={{flexDirection: 'column', paddingHorizontal: 14}}>
                        <Text style={[{fontSize: 14, paddingVertical: 7}]}>{params.advertisement.name}</Text>
                        <Text style={[styles.text2, {fontSize: 12, width: '150%', paddingBottom: 5}]}>{params.advertisement.mail}</Text>
                    </View>
                    <TouchableOpacity style={[styles.addButton,smallStyles.ownButton,smallStyles.color]}>
                        <Text style={[styles.buttonText,{fontSize:14}]}>{t('addoctor')}</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const smallStyles={
    color:{
        backgroundColor:'#86abba',
    },

    imageStyle: {
        height: 50,
        width: 50,
        resizeMode:'cover',
        borderRadius:50,
        justifyContent:'start'
    },

    ownButton:{
        height: '90%',
        width: '40%',
        justifyContent:'right',
    }
} 