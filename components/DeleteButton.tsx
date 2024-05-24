import React from 'react'
import {StyleSheet, View, Dimensions} from 'react-native'
import {Button, ButtonProps} from 'react-native-elements'

interface DeleteButtonProps extends ButtonProps {
    onPress: any;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onPress }) => {
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
                    onPress={() => onPress}
                />
            </View>
        </View>
    )
}


export default DeleteButton

const styles = StyleSheet.create({
    screen: {
        backgroundColor: "#E9F4E9FF",
        height: "100%",
    }
})