import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity, ImageStyle, StyleSheet,
} from 'react-native';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";
import { Advertisement, BannerProps,Doctor } from '../lib/types';
import { getClientDoctor } from '../lib/supabase';

export const SmallBanner: React.FC<BannerProps> = (params:BannerProps)=>{
    const {t} = useTranslation();
    const handleOnPress = async (advertisement:Advertisement) => {
        const doc:(Doctor| undefined) = await getClientDoctor(advertisement.client);
        params.onPress(doc);
    };
    return (
        <View>
            {params.advertisement && (
                <View style={[styles.cards,{flexDirection: 'row',borderColor:'#86abba',borderWidth:3, justifyContent: 'space-between'}]}>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={{uri: params.advertisement.image_url}} style={smallStyles.imageStyle}/>
                        <View style={{flexDirection: 'column', paddingHorizontal: 14}}>
                            <Text style={[{fontSize: 14, paddingVertical: 7}]}>{params.advertisement.name}</Text>
                            <Text style={[styles.text2, {fontSize: 12, width: '150%', paddingBottom: 5}]}>{params.advertisement.mail}</Text>
                        </View>
                    </View>
                    <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
                        <TouchableOpacity style={[styles.addButton, smallStyles.ownButton]} onPress={()=>{handleOnPress(params.advertisement)}}>
                            <Text style={[styles.buttonText,{fontSize:12, textAlign: 'center'}]}>{t('addoctor')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}


const smallStyles = StyleSheet.create({
    imageStyle: {
        height: '90%',
        width: '22%',
        resizeMode:'cover' as ImageStyle['resizeMode'],
        borderRadius:50,
        alignSelf: 'center'
    },
    ownButton:{
        backgroundColor:'#86abba',
        width: '100%',
    }
} )