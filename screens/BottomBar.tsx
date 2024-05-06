import React from 'react';
import { NativeBaseProvider, Text, Icon, HStack, Center, Pressable } from 'native-base';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {View} from "react-native";

function BottomBar() {
    const [selected, setSelected] = React.useState(0);
    return <NativeBaseProvider>
    <View style={{backgroundColor: '#3EB77F'}}>
        <HStack alignItems="center" safeAreaBottom shadow={6}>
                <Pressable opacity={selected === 0 ? 1 : 0.5} py="3" flex={1}
                           onPress={() => { setSelected(0)}}>
                    <Center>
                        <Icon as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'} />} color="white" size={10} />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 1 ? 1 : 0.5} py="2" flex={1}
                           onPress={() => setSelected(1)}>
                    <Center>
                        <Icon as={<MaterialIcons name="date-range" />} color="white" size={10} />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
                    <Center>
                        <Icon as={<MaterialCommunityIcons name="doctor" />} color="white" size={10} />
                    </Center>
                </Pressable>
                <Pressable opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 3 ? 'account' : 'account-outline'} />} color="white" size={10} />
                    </Center>
                </Pressable>
            </HStack>
        </View>
    </NativeBaseProvider>;
}

export default BottomBar;
