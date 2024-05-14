import React, {useState} from 'react';
import {SafeAreaView, Alert, StyleSheet, View,} from 'react-native';
import {addDependentUser} from "../lib/supabase";
import {Button, Icon, Input, Text} from "react-native-elements";
import { Image } from 'react-native';
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";

type AddDependentUserProps = NativeStackScreenProps<RootStackParamList, 'AddDependentUser'>


const AddDependentUser:React.FC<AddDependentUserProps> = ({navigation, route}) => {
    const session = route.params.session;
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [dni,setDni]  = useState('')
    const [loading,setLoading]= useState(false)
    const [DNIErrorMessage, setDNIErrorMessage] = useState<string>('');
    
    const validateDNI = (value: string) => {
        const containsLetterOrSymbol = /([a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?\/\\|'"`~-])/.test(value);
        if (containsLetterOrSymbol) {
            setDNIErrorMessage('Debe ingresar su DNI. Ej: 12345678');
        } else {
            setDNIErrorMessage('');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.window}>
            <Text style={styles.screenTitle}>Nuevo Usuario</Text>
                <Input
                    label="Nombre"
                    labelStyle={styles.colorLable}
                    leftIcon={<Icon type="material-icons" name="person" color={styles.colorLable.color}/>}
                    onChangeText={(text) => setFirstName(text)}
                    value={firstName}
                    placeholder="Nombre"
                    autoCapitalize={'none'}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    placeholderTextColor={"#407738"}
                />
                <Input
                    label="Apellido"
                    labelStyle={styles.colorLable}
                    leftIcon={<Icon type="material-icons" name="person" color={styles.colorLable.color}/>}
                    onChangeText={(text) => setLastName(text)}
                    value={lastName}
                    placeholder="Apellido"
                    autoCapitalize={'none'}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    placeholderTextColor={"#407738"}
                />
                <Input
                    label="DNI"
                    labelStyle={styles.colorLable}
                    leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
                    onChangeText={(text) => {
                        setDni(text);
                        validateDNI(text);
                    }}
                    value={dni}
                    placeholder="DNI"
                    autoCapitalize={'none'}
                    placeholderTextColor={"#407738"}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    errorStyle={{ color: 'red' }}
                    errorMessage={DNIErrorMessage}
                />
                <Button
                    title="Agregar"
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
                    onPress={() => addDependentUser({first_name: firstName,
                        last_name :lastName, dni:dni})}
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
