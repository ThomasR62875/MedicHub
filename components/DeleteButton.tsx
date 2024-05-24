import React from 'react'
import {StyleSheet, View, Dimensions} from 'react-native'
import {Button} from 'react-native-elements'

const DeleteButton: React.FC = ({ navigation, route } : any) => {
    const {session} = route.params;
    const screenHeight = Dimensions.get('window').height;
    const [visible, setVisible] = React.useState(false);

    const showDialog = () => setVisible(true);


    return (
        <View style={styles.screen}>
            <View style={{alignItems: 'center', width: 'auto'}}>
                <Button
                    title="Eliminar"
                    buttonStyle={{
                        backgroundColor: '#2E5829',
                        borderWidth: 2,
                        borderColor: 'white',
                        borderRadius: 30,
                        minHeight: 50,
                        minWidth: 150,
                    }}
                    containerStyle={{
                        width: 150,
                        marginHorizontal: 50,
                        marginVertical: 10,
                        marginTop: 40,
                        marginBottom:100
                    }}
                    titleStyle={{ color: '#eef9ed' }}
                    onPress={()=>showDialog()}
                />
            </View>
        </View>
    )
}


export default DeleteButton

const styles = StyleSheet.create({
    cerrarSesion:{
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#073A29',
        borderRadius: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
        alignSelf: 'center',
        marginLeft: 10,
    },
    grid: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '100%',
    },
    misCosas: {
        width: 225,
        backgroundColor: '#cae4c8',
        borderColor: '#cae4c8',
        borderWidth: 1,
        color: 'black',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: "2%"
    },
    text2: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        marginTop: "1%",
        color: "#1a4212",
        width: "60%"
    },
    title: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        marginTop: "1%",
        color: "#245e1e",
        width: "60%"
    },
    buttonText: {
        alignSelf: 'center',
        color: '#12210f',
        fontSize: 20,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        padding: 20,
        borderRadius: 15,
        alignSelf: 'center',
        marginBottom: 20,
    },
    modalInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontSize: 20,
        color: 'white',
    },
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
    topContent: {
        alignItems: "center",
        marginTop: "25%",
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        marginBottom: "5%",
        color: "#2E5829FF",
        width: "60%"
    },
    main: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        marginLeft: '5%'
    },
    iconContainer: {
        alignItems: 'flex-start',
    },
    name: {
        color: "#2E5829FF",
        fontSize: 20,
    },
    namesContainer: {
        marginLeft: "2%",
        marginTop: '10%'
    }, icons: {
        color: '#2E5829FF',
    },
    buttonContainer: {
        width: 225, // Ancho deseado para todos los botones
        marginVertical: 10,
    }


})