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
        color: '#000',
        fontFamily: 'Roboto-Thin',
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
        marginLeft: '15%',
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
        borderWidth: 1,
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
    },
    cerrarSesion:{
        width: '50%',
        alignSelf: 'center',
        backgroundColor: '#073A29',
        borderRadius: 10,
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
        borderRadius: 17,
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        marginBottom: "2%"
    },
    text2: {
        fontFamily: 'Roboto-Thin',
        fontSize: 16,
        marginTop: "1%",
        color: "#A8A8A8",
        width: "60%"
    },
    title: {
        fontFamily: 'Roboto-Thin',
        fontSize: 16,
        marginTop: "1%",
        color: "#000000",
        width: "60%"
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
    },
    infoRow: {
        flexDirection: 'row',
    },
    label: {
        fontWeight: 'bold',
        marginRight: 5,
    },
});