import React, {useState} from 'react';
import {SafeAreaView,TouchableOpacity, Text, Alert, StyleSheet, } from 'react-native';
import {supabase} from "../lib/supabase";
import {Input} from "react-native-elements";
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
        <SafeAreaView style={styles.container}>
          
          <Input
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            style={styles.verticallySpaced}
            placeholder="Nombre"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
        <Input
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            style={styles.verticallySpaced}
            placeholder="Apellido"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
            <Input
            leftIcon={<Image source={require('../assets/fingerprint.png')} style={styles.icon} />}
            style={styles.verticallySpaced}
            placeholder="DNI"
            value={dni}
            onChangeText={(text) => setDni(text)}
            // type="number"
            />
            <StandardGreenButton title="Confirmar"
                                 disabled={loading}
                                 onPress={() => addUser()}
            />
        </SafeAreaView>
      );

}

export default AddDependentUser;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
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
    },
  });
