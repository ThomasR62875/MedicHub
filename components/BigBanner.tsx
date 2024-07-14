import React from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { Advertisement, BannerProps, Doctor } from '../lib/types';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";
import { getClientDoctor } from '../lib/supabase';

export const BigBanner: React.FC<BannerProps>= (params:BannerProps) => {
    const {t} = useTranslation();
    const handleOnPress = async (advertisement:Advertisement) => {
        const doc:(Doctor| undefined) = await getClientDoctor(advertisement.client);
        params.onPress(doc);
    };
    return(
        <View>
            {params.advertisement && (
                <View style={bigStyles.container}>
                    <Image source={{uri: params.advertisement.image_url}} style={bigStyles.imageStyle} />
                    <View style={[{width:'100%'}]}>
                        <TouchableOpacity style={[bigStyles.button,bigStyles.color]} onPress={()=>{handleOnPress(params.advertisement)}}>
                            <Text style={[styles.buttonText,{fontSize:16,justifyContent:'center',textAlign:'center'}]}>{t('addoctor')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const bigStyles=StyleSheet.create({
    color:{
        backgroundColor:'#86abba',
    },
    imageStyle: {
        height: 300,
        width: 300,
        resizeMode:'stretch',
        borderRadius:20,
    },

    container:{
        alignItems:'center',
        borderWidth:5,
        borderColor: '#86abba',
        borderRadius:25
    },

    button:{
        justifyContent: 'center',
        borderBottomRightRadius:20,
        borderBottomLeftRadius:20,
    }
});