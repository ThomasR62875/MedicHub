import React, {useEffect} from 'react';
import { NativeBaseProvider, Icon, HStack, Center, Pressable } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {View} from "react-native";

type BarProps = {
    navigation: any; // Accept any type of navigation prop
    route: any; // Accept any type of route prop
};

const BottomBar : React.FC<BarProps> = ({navigation, route}) => {
    const [selected, setSelected] = React.useState(0);
    const {session} = route.params;

    useEffect(() => {
        switch (route.name) {
            case 'Home':
                setSelected(0);
                break;
            case 'Calender':
                setSelected(1);
                break;
            case 'Doctors':
                setSelected(2);
                break;
            default:
                setSelected(0);
                break;
        }
    }, [route]);

    return <NativeBaseProvider>
    <View style={{backgroundColor: '#3EB77F'}}>
        <HStack alignItems="center" safeAreaBottom shadow={6}>
                <Pressable opacity={selected === 0 ? 3 : 0.5} py="3" flex={1}
                           onPress={() => {
                               setSelected(0);
                               navigation.navigate({name: 'Home', params: {session: session}});}}>
                    <Center>
                        <Icon as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size={10} />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 1 ? 3 : 0.5} flex={1}
                           onPress={() => {
                               setSelected(1);
                               navigation.navigate({name: 'Calender', params: {session: session}});}}>
                    <Center>
                        <Icon as={<MaterialIcons name="date-range" />} color="white" size={10} />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 2 ? 3 : 0.5} flex={1}
                           onPress={() => {
                               setSelected(2);
                               navigation.navigate({name: 'Doctors', params: {session: session}});}}>
                    <Center>
                        <Icon as={<MaterialCommunityIcons name="doctor" />} color="white" size={10} />
                    </Center>
                </Pressable>
            </HStack>
        </View>
    </NativeBaseProvider>;
}

export default BottomBar;
