import {NativeStackScreenProps} from "@react-navigation/native-stack";
import {RootStackParamList} from "../App";
import React from "react";
import {View} from "react-native";


type MedicationProps = NativeStackScreenProps<RootStackParamList, 'Medication'>;


const Medication: React.FC<MedicationProps> = ({ navigation, route }) =>{
    const {session} = route.params;
    return(
        <View>

        </View>
    )
}

export default Medication;