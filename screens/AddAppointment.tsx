import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SafeAreaView,StyleSheet,Alert , Text, TouchableOpacity } from 'react-native'
import { Session } from '@supabase/supabase-js'
import {Input} from "react-native-elements";
import DateTimePicker from 'react-native-ui-datepicker';
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
          <Input
            leftIcon={{ type: 'font-awesome', name: 'paperclip' }}
            style={styles.verticallySpaced}
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
    verticallySpaced: {
      paddingTop: 2,
      paddingBottom: 2,
      alignSelf: 'stretch',
  },
    confirmButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    },
    confirmButtonText: {
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    },
  });