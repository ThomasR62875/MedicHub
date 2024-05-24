import React from 'react'
import {StyleSheet, View, Dimensions} from 'react-native'
import {Button, ButtonProps} from 'react-native-elements'
import {Dialog, Text, Button as PaperButton} from "react-native-paper";

interface DeleteButtonProps extends ButtonProps {
    onPress: any;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onPress }) => {
    const [visible, setVisible] = React.useState(false);

    const hideDialog = () => setVisible(false);
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
                    onPress={() => showDialog()}
                />
            </View>
        <Dialog style={styles.dialog}
                visible={visible}
                onDismiss={hideDialog}>
            <Dialog.Content>
                <Text variant="bodyMedium" style={[{textAlign: 'center'}, {fontSize: 18}]}>
                    ¿Está seguro de que desea eliminar?
                </Text>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: 'space-between' }}>
                <PaperButton textColor="#2E5829FF"
                             onPress={hideDialog}>
                    Cancelar
                </PaperButton>
                <PaperButton textColor="#b6265d"
                             onPress={onPress}>
                    Eliminar
                </PaperButton>
            </Dialog.Actions>
        </Dialog>
        </View>

    )
}


export default DeleteButton

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    },
    dialog:{
        backgroundColor: '#E9F4E9FF',

    }
})