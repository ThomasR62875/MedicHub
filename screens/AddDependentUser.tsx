import React, {useState} from 'react';
import {SafeAreaView, Alert, StyleSheet, View,} from 'react-native';
import {supabase} from "../lib/supabase";
import {Button, Icon, Input, Text} from "react-native-elements";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import { Image } from 'react-native';
import StandardGreenButton from "../components/StandardGreenButton";

type AddDependentUser = NativeStackScreenProps<RootStackParamList, 'AddDependentUser'>;


const AddDependentUser: React.FC<AddDependentUser> = ({ navigation, route }) => {
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [dni,setDni]  = useState('')
    const [loading,setLoading]= useState(false)


    async function addUser() {
        setLoading(true)
            try{
                const { error } = await supabase.rpc("add_dependent_user",{first_name_input: firstName,
                    last_name_input :lastName, dni_input:dni})
                Alert.alert("El Usuario ya está guardado")
                if (error!= null){
                    throw error
                }
            }
            catch(error){
                if (error instanceof Error) {
                    Alert.alert(error.message)
                }
            }
        setLoading(false)
    }

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
                    secureTextEntry={true}
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
                    secureTextEntry={true}
                    placeholder="Apellido"
                    autoCapitalize={'none'}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    placeholderTextColor={"#407738"}
                />
                <Input
                    label="DNI"
                    labelStyle={styles.colorLable}
                    leftIcon={<Icon type="material-icons" name="fingerprint" color={styles.colorLable.color}/>}
                    onChangeText={(text) => setDni(text)}
                    value={dni}
                    secureTextEntry={true}
                    placeholder="DNI"
                    autoCapitalize={'none'}
                    inputStyle={{color: '#407738', marginLeft: 10}}
                    placeholderTextColor={"#407738"}
                />
                <Button
                    title="Agregar"
                    loading={loading}
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
                    onPress={() => addUser()}
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
    containerTotal:{
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    verticallySpaced: {
      paddingTop: 2,
      paddingBottom: 2,
      alignSelf: 'stretch',
  },
    confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    },
    confirmButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    icon: {
        width: 24,
        height: 24,
    }, screenTitle: {
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
