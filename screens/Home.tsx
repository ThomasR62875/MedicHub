import React, {useState} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import {Icon} from "react-native-elements";
import {Card} from '../components/Card';


const Home: React.FC = ({navigation}: any) => {

    const [first_name, setFirstName] = useState('')

    return (
        <View>
            <View style={styles.profileIconContainer} >
                <Icon name='person-circle-outline' type='ionicon' onPress={() => navigation.navigate('Account')} size={35} />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Bienvenido {first_name} test!!</Text>
                <View style={styles.grid}>
                    <View style={styles.col}>
                        <Card title="Agregar turno" img="../assets/splash.png"  onPress={() => navigation.navigate('AddAppointment')} />
                        <View style={{ marginBottom: 10 }} />
                        <Card title="Turnos" img="../assets/splash.png" onPress={() => navigation.navigate('Appointments')}/>
                    </View>
                    <View style={styles.col}>
                        <Card title="Agregar doctor" img="../assets/doc.png"  onPress={() => navigation.navigate('AddDoctor')}/>
                        <View style={{ marginBottom: 10 }} />
                        <Card title="Doctors" img="../assets/doc.png"  onPress={() => navigation.navigate('Doctors')}/>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileIconContainer: {
        top: 5,
        left: 310,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B5DCCA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginRight: 10,
    },
    text: {
        fontSize: 25,
    }
});

export default Home;
