import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    tab: {
        flex: 1,
        backgroundColor: "#fff",
        height: '100%',
        paddingLeft: 16
    },
    tabTitle: {
        color: 'black',
        fontSize: 24,
        fontFamily: 'Roboto-Thin',
        paddingLeft: 25,
        paddingTop: 100
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        padding: 15,
        fontWeight: 'bold'
    },
    container: {

    },
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: "1%",
        color: "#2E5829",
    },
    text: {
        fontSize: 20,
        textAlign: 'left',
        color: "#2E5829",
        fontFamily: 'Roboto-Thin',
        margin: "4%"
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 10,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 3,
        height: 45
    },
    img: {
        height: 150,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },
    turnoContainer: {
        backgroundColor: '#CBE4C9',
        borderRadius: 20,
        borderColor: '#CBE4C9',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
    },
    logo:{
        color: '#407738',
        width: 50,
        height: 50,

    },
    topContent: {
        alignItems: 'flex-start',
        marginTop: "8%",
        marginLeft: "6%"
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15%'
    },
    screenTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 16,
        color: "#807d7d",
        paddingLeft: 25,
        paddingTop: 10
    },
    squiggle: {
        position: 'absolute',
        top: -20,
        left: 225,
    },
    buttons: {
        backgroundColor: '#8B86BE',
        borderRadius: 15,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '35%',
        marginRight: '2%'
    },
    subtitles: {
        fontFamily: 'Roboto-Thin',
        fontSize: 16,
        color: "#807d7d",
        paddingLeft: 25,
        padding: 15,
        marginTop: 20
    },
    calendarContainer: {
        marginTop: '5%',
        marginRight: '4%',
        backgroundColor: "#ffffff"
    },
    divider: {
        borderBottomColor: '#e1dfdf',
        borderBottomWidth: 2,
        marginRight: '15%',
        marginLeft: '10%',
        marginTop: '5%'
    },
    turno: {
        backgroundColor: '#CBE4C9',
        borderRadius: 20,
        borderColor: '#CBE4C9',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
        padding: "2%",
    },
    addButton: {
        backgroundColor: '#86abba',
        borderColor: 'white',
        borderRadius: 15,
        width: '40%',
        maxHeight: '90%',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    cards:{
        borderWidth: 2,
        borderColor: '#A8A8A8',
        padding: 10,
        borderRadius: 20,
        shadowRadius:2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        backgroundColor: 'white',
        marginBottom: '2%',
    },
    listCards: {
        paddingRight: 20,
        paddingLeft: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
    },
    circleCard:{
        borderRadius: 30,
        height: 45,
        width: 45,
        padding: 10,
    },
    cardText: {
        fontSize: 14,
        padding: 15,
        paddingLeft: 20
    }
});