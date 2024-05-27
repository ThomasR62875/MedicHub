import React, {useEffect, useState} from 'react';
import {Alert, StyleSheet, View,} from 'react-native';
import {addDependentUser} from "../lib/supabase";
import {Button, Icon, Input, Text} from "react-native-elements";
import {Image} from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import {useTranslation} from "react-i18next";

type AddDependentUserProps = NativeStackScreenProps<RootStackParamList, 'AddDependentUser'>

const AddDependentUser:React.FC<AddDependentUserProps> = ({navigation, route}) => {
    const session = route.params.session;
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [dni,setDni]  = useState('')
    const [loading,setLoading]= useState(false)
    const [firstNameErrorMessage, setFirstNameErrorMessage] = useState('')
    const [lastNameErrorMessage, setLastNameErrorMessage] = useState('')
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    const {t} = useTranslation();

    useEffect(() => {
        if (
            firstName.trim() !== '' &&
            lastName.trim() !== '' &&
            firstNameErrorMessage === '' &&
            lastNameErrorMessage === ''
        ) {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [firstName, lastName, dni]);

    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);

    const validateFirstName = (value: string) => {
        if (value.trim() === '') {
            setFirstNameErrorMessage(t('warn17'));
        } else {
            setFirstNameErrorMessage('');
        }
    };
    const validateLastName = (value: string) => {
        if (value.trim() === '') {
            setLastNameErrorMessage(t('warn18'));
        } else {
            setLastNameErrorMessage('');
        }
    };
    const validateDNI = (value: string) => {
        const containsLetterOrSymbol = /([a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-])/.test(value);
        if (containsLetterOrSymbol) {
            setDNIErrorMessage(t('warn3'));
        } else {
            setDNIErrorMessage('');
        }
    };

    const handleAddDependentUser = async () => {
        const dep_user = {
            first_name: firstName, last_name :lastName, dni:dni, id: ''};

        const result = await addDependentUser(dep_user);
        if (result.success) {
            Alert.alert(t('text9'), '',
                [{ text: 'Ok', onPress: () => navigation.navigate('DependentUsers', { session: session }) }]
            );
        } else {
            Alert.alert('Error', result.message || 'An unknown error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.window}>
            <Text style={styles.screenTitle}>{t('newu')}</Text>
                <Input
                    label={t('name')}
                    labelStyle={styles.colorLable}
                    leftIcon={<Icon type="material-icons" name="person" color={styles.colorLable.color}/>}
                    onChangeText={(text) => {
                        setFirstName(text);
                        validateFirstName(text)
                    }}
                    value={firstName}
                    placeholder={t('name')}
                    autoCapitalize={'none'}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    placeholderTextColor={"#407738"}
                    errorStyle={{ color: 'red' }}
                    errorMessage={firstNameErrorMessage}
                />
                <Input
                    label={t('surname')}
                    labelStyle={styles.colorLable}
                    leftIcon={<Icon type="material-icons" name="person" color={styles.colorLable.color}/>}
                    onChangeText={(text) => {
                        setLastName(text);
                        validateLastName(text)
                    }}
                    value={lastName}
                    placeholder={t('surname')}
                    autoCapitalize={'none'}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    placeholderTextColor={"#407738"}
                    errorStyle={{ color: 'red' }}
                    errorMessage={firstNameErrorMessage}
                />
                <Input
                    label={t('id')}
                    labelStyle={styles.colorLable}
                    leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                    onChangeText={(text) => {
                        setDni(text);
                        validateDNI(text);
                    }}
                    value={dni}
                    placeholder={t('id')}
                    autoCapitalize={'none'}
                    placeholderTextColor={"#407738"}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    errorStyle={{ color: 'red' }}
                    errorMessage={DNIErrorMessage}
                />
                <Button
                    title={t('add')}
                    disabled={isButtonDisabled}
                    buttonStyle={{
                        backgroundColor: '#2E5829',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50
                    }}
                    containerStyle={{
                        width: 150,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        marginTop: 40,
                    }}
                    titleStyle={{ color: '#eef9ed' }}

                    onPress={handleAddDependentUser}
                />
            </View>
        </View>
      );
}

export default AddDependentUser;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#e9f4e9', height: "100%"
    },
    icon: {
        width: 24,
        height: 24,
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        marginBottom: "15%",
        color: "#2E5829FF",
    },
    window: {
        alignItems: 'center',
        marginTop: "20%",
        width: "90%",
    },
    colorLable: {
        color: '#2E5829FF',
    },
});
