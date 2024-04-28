import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import React from "react";
import {Text, View} from "react-native";


type MedicationProps = NativeStackScreenProps<RootStackParamList, 'Medication'>;


const Medication: React.FC<MedicationProps> = ({ navigation, route }) =>{
    const {session} = route.params;
    return(
        <View style={{marginTop: 50, alignItems: 'center'}}>
            <Text>Para el sprint 3</Text>
        </View>
    )
}

export default Medication;