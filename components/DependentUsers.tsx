import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, ScrollView,Text} from 'react-native'
import { Session } from '@supabase/supabase-js'



interface Users {
    first_name: string;
    last_name: string;
    dni: string;
}

export default function DependentUsers({ session }: { session: Session }) {
    const [loading, setLoading] = useState(true)
    const [users,setUsers]= useState([])

    useEffect(() => {
        if (session) getUsers()
    }, [session])
    async function getUsers():Doctor[] {
        let to_return: Doctor[]=[]
        try {
            setLoading(true)
            if (!session?.user) throw new Error('No user on the session!')

            const {data, error, status} = await supabase
                .from('doctor')
                .select()
                .contains('users', [session?.user.id])
            if (error && status !== 406) {
                throw error
            }

            if (data) {
                data.forEach(doctor => {
                    to_return.push({
                        name: doctor.name,
                        profession: doctor.profession,
                        phone: doctor.phone,
                        email: doctor.email,
                        address: doctor.addresses
                    })
                });
            }
        
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            }
        }
        setLoading(false)
        setDoctors(to_return)
    }
}