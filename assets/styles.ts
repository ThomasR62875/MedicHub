import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    tab: {
        flex: 1,
        backgroundColor: "#fff",
        height: '100%',
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
    container: {},
    col: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    titleText: {
        fontFamily: 'Roboto-Thin',
        fontSize: 20,
        textAlign: 'center',
        paddingTop: '15%',
        color: "#000",
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
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
    squiggle_left: {
        position: 'absolute',
        top: -20,
        left: -20,
    },
    back_arrow: {
        paddingVertical: '15%',
    },
    stackTitle: {
        color: 'black',
        fontSize: 24,
        fontFamily: 'Roboto-Thin',
        paddingLeft: 25,
        paddingTop: 50
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
        backgroundColor: "#ffffff",
        paddingLeft: 16
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
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.85,
        padding: "2%",
    },
    addButton: {
        backgroundColor: '#86abba',
        borderColor: 'white',
        borderRadius: 15,
        width: '40%',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
    },
    cards: {
        borderWidth: 1,
        borderColor: '#A8A8A8',
        padding: 10,
        borderRadius: 20,
        shadowRadius: 2.5,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
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
    circleCard: {
        borderRadius: 30,
        height: 45,
        width: 45,
        padding: 10,
    },
    circleHeader: {
        borderRadius: 30,
        height: 60,
        width: 60,
        padding: 20
    },
    cardText: {
        fontSize: 14,
        padding: 15,
        paddingLeft: 20
    },
    cerrarSesion: {
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
        fontSize: 14,
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
        height: "100%",
    },
    main: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignItems: 'flex-start',
        display: 'flex',
        marginLeft: '5%'
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
        fontSize: 16,
        marginRight: 5,
        paddingVertical: 10

    },
    header: {
        borderRadius: 30,
        height: '20%',
        top: 0
    },
    titleContainer: {
        fontSize: 25,
        fontWeight: 'bold',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: 'row',
        margin: 10,
    },
    value: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Roboto-Thin',
        color: '#807d7d',
        textAlign: 'right',
        paddingVertical: 10
    },
    addContainer: {
        left: 290,
        bottom: 60,
        alignSelf: 'flex-start',
    },
    dialog: {
        backgroundColor: '#fff',
        padding: 15
    },
    shareUserBotton: {
        borderRadius: 10,
        borderColor: '#8B86BE',
        margin: '5%',
        width: '60%'
    },
    inputStyle: {
        marginTop: '5%',
        marginBottom: '5%',
    },
    buttonSignInContainer: {
        width: '50%',
        justifyContent: 'center',
    },
    buttonSignIn: {
        backgroundColor: '#B5DCCA',
        borderRadius: 10,
        justifyContent: 'center',
    },
    colorIcon: {
        color: '#000'
    },
    colorLabel: {
        color: '#2E5829FF',
        fontSize: 12
    },
    icon: {
        width: 24,
        height: 24,
    },
    registerW: {
        backgroundColor: '#e9f4e9',
        height: '100%',
        marginLeft: 10,
        marginRight: 10,
        alignContent: 'center'
    },
    makeIndepUserBotton: {
        borderRadius: 10,
        margin: '5%',
        borderColor: '#8B86BE',
        borderWidth: 1,
    },
    text3: {
        fontFamily: 'Roboto-Thin',
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        color: "#000",
    },
    pickerStyle: {
        marginBottom: 20,
    },
    datePicker: {
        alignSelf: 'center',
        marginTop: "5%",
    },
    pickerButton: {
        borderRadius: 10,
        marginLeft: '5%',
        marginRight: '5%',
    },
    dialogTitle: {
        fontFamily: 'Roboto-Thin',
        fontSize: 22,
        textAlign: 'center',
        fontWeight: 'bold',
        margin: "5%",
        marginLeft: '15%',
        color: "#000",
        width: "70%"
    },
    input: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderWidth: 1,
        borderRadius: 15,
    },
    buttonRegisterContainer: {
        width: '100%',
    },
    buttonRegister: {
        backgroundColor: '#ffffff',
        width: 'auto',
    },
    logo: {
        color: '#86ABBA',
        width: 80,
        height: 80
    },
    iconContainer: {
        textAlign: "center",
    },
    activityIndicator: {
        position: 'absolute',
        right: 16,
    },
    window: {
        marginBottom: 50,
        alignItems: 'center',
        marginTop: "25%",
    },
    logInContainer: {
        alignItems: 'center'
    },
    bubble: {
        position: 'absolute',
    },
    bubbleContainer: {
        width: '200%',
        height: '200%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    Ptitle: {
        color: '#000000',
        textAlign: 'center',
        marginBottom: 80,
        marginTop: 0,
        fontSize: 20,
        fontWeight: 'bold'
    },
    text4: {
        fontSize: 16,
        textAlign: 'left',
        color: '#000',
        paddingHorizontal: 12,
        paddingBottom: 12,
        fontFamily: 'Roboto-Thin',
        fontWeight: 'bold'
    },
    text5: {
        fontSize: 16,
        textAlign: 'left',
        color: '#000',
        paddingHorizontal: 12,
        paddingBottom: 12,
        fontFamily: 'Roboto-Thin',
    },
    label2: {
        color: '#000000',
        paddingBottom: 10,
        paddingLeft: 5,
        fontWeight: 'normal',
        fontSize: 14,
        fontFamily: 'Roboto-Thin'
    },
    datePickerContainer: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'center',
        marginLeft: '10%',
        marginRight: '15%',
        marginTop: '10%',
        marginBottom: '10%'
    },
});