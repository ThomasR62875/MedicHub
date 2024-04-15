import React from 'react';
import { View, Text, Button } from 'react-native';

const Home: React.FC = ({navigation}: any) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>HomeScreen!</Text>
            <Button title="Account" onPress={() => navigation.navigate('Account')}/>
            <Button title="Add Appointment" onPress= {()=> navigation.navigate('AddAppointment')}/>
            <Button title="Appointments" onPress= {()=> navigation.navigate('Appointments')}/>
            <Button title="AddDoctor" onPress={() => navigation.navigate('AddDoctor')}/>
        </View>
    );
};

export default Home;
