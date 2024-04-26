import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from 'react';
import {NavigationContainer, RouteProp} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Auth from './components/Auth';
import Home from './screens/Home';
import Account from "./components/Account";
import Register from "./screens/Register";
import Appointments from "./components/Appointments"
import AddAppointment from "./screens/AddAppointment"
import Doctors from "./screens/Doctors";
import AddDoctor from "./components/AddDoctor";
import AddDependentUser from './components/AddDependentUser'
import {Props} from "@react-navigation/stack/lib/typescript/src/views/Header/HeaderContainer";
import {StackNavigationProp} from "@react-navigation/stack";

const Stack = createNativeStackNavigator();


export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    supabase.auth.getSession();

    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      unsubscribe;
    };
  }, []);


  return (
      <NavigationContainer>
        <Stack.Navigator>
          {!session ? (
              <>
                  <Stack.Screen name="LogIn" component={Auth} />
                  <Stack.Screen name="Register" component={Register} />
              </>
          ) : (
              <>
              <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Account">
                  {(props) =><Account {...props} session={session} />}
                </Stack.Screen>
                <Stack.Screen name="Appointments">
                  {(props) =><Appointments {...props} session={session}/>}
                </Stack.Screen>
                <Stack.Screen name="AddAppointment">
                  {(props) =><AddAppointment {...props} session={session}/>}
                </Stack.Screen>
                <Stack.Screen name="AddDoctor">
                  {(props) =><AddDoctor {...props} session={session} />}
                </Stack.Screen>
                <Stack.Screen name="Doctors">
                  {(props) =><Doctors {...props} session={session} />}
                </Stack.Screen>
                <Stack.Screen name="AddDependentUser">
                  {(props) =><AddDependentUser{...props} session={session}/>}
                </Stack.Screen>
              </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}