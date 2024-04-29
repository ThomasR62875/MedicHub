import React, {useState} from 'react';
import { View, Text, StyleSheet} from 'react-native';
import {Icon} from "react-native-elements";
import {Card} from '../components/Card';


const Home: React.FC = ({navigation}: any) => {
    const [first_name, setFirstName] = useState('')
    const imgDoc = require('../assets/doc.png');
    const imgTurno = require('../assets/calendario.png');
    const imgMed = require('../assets/meds.png');
    return (

        <View>
            <View style={styles.profileIconContainer} >
                <Icon name='person-circle-outline' type='ionicon' onPress={() => navigation.navigate('Account')} size={35} />
            </View>
            <View style={styles.container}>
                <Text style={styles.text}>Bienvenido {first_name} test!!</Text>
                <View style={styles.grid}>
                    <View style={styles.col}>
                        <Card title="Agregar turno" img={imgDoc}  onPress={() => navigation.navigate('AddAppointment')} />
                        <View style={{ marginBottom: 10 }} />
                        <Card title="Turnos" img={imgTurno} onPress={() => navigation.navigate('Appointments')}/>
                    </View>
                    <View style={styles.col}>
                        <Card title="Médicos" img={imgDoc}  onPress={() => navigation.navigate('Doctors')}/>
                        <View style={{ marginBottom: 10 }} />
                        <Card title="Medicamentos" img={imgMed}  onPress={() => navigation.navigate('Medication')}/>
                    </View>
                    {/*<View style={styles.col}>*/}
                    {/*    <Card title="Agregar usuario" onPress={()=> navigation.navigate('AddDependentUser')}/>*/}
                    {/*</View>*/}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    profileIconContainer: {
        top: 10,
        left: 315,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#B5DCCA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginRight: 10,
    },
    text: {
        fontSize: 25,
        marginBottom: 5,
    }
});

export default Home;
