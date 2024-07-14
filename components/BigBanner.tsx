import React from 'react';
import {
    Text,
    Image,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import { BannerProps } from '../lib/types';
import { styles } from '../assets/styles';
import {useTranslation} from "react-i18next";

export const BigBanner: React.FC<BannerProps>= (params:BannerProps) => {
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