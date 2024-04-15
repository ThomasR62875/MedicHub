import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SafeAreaView,StyleSheet,Alert ,TextInput, Text, TouchableOpacity } from 'react-native'
import { Session } from '@supabase/supabase-js'
import DateTimePicker, {DateType} from 'react-native-ui-datepicker';
import dayjs from 'dayjs';


export default function AddAppointment({ session}: { session: Session}) {
    const [date, setDate] = useState(dayjs())
    const [loading, setLoading] = useState(false)
    const [description, setDescription] = useState('')
    
    async function setAppointment() {
        setLoading(true)
        if (!session?.user) throw new Error('No user on the session!')

        const { data, error } = await supabase
        .from('appointment')
        .insert([
        { date: date, description: description, user: session?.user.id},
        ])
        .select()

        if (error) Alert.alert(error.message)
        else (Alert.alert("El turno ya está cargado"))
        setLoading(false)
    }

    return (
        <SafeAreaView style={styles.container}>
          {/* Date Picker */}
          <DateTimePicker
            mode="single"
            date={date}
            onChange={(params) => setDate(params.date)}
            displayFullDays
            style={styles.datePicker}
          />
        
          {/* Description Input */}
          {/*multiline={true}
         numberOfLines={4}*/}
          <TextInput
            style={styles.descriptionInput}
            placeholder="Enter description"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
      
          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={() => setAppointment()}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    datePicker: {
      height: '20',
    },
    descriptionInput: {
      height: 100,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      marginTop: 20,
      padding: 10,
      textAlignVertical: 'top',
    },
    confirmButton: {
        backgroundColor: '#B5DCCA',
        borderRadius: 10,
    },
    confirmButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });