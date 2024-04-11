import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './components/Auth';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const {data: sessionData, error} = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      } else {
        // Verificar si hay una sesión y asignarla
        if (sessionData) {
          setSession(sessionData.session);
        } else {
          setSession(null);
        }
      }
  };
    getSession();

    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      unsubscribe;
    };
},[]);

  return (
      <NavigationContainer>
        <Stack.Navigator>
          {!session ? (
              <Stack.Screen name="LogIn" component={Auth} />
          ) : (
              <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}
  //   //--------------
  //
  //   supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  //   })
  //
  //   supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //   })
  // }, [])
  //
  // return (
  //     <View>
  //       <Auth />
  //       {session && session.user && <Text>{session.user.id}</Text>}
  //     </View>
