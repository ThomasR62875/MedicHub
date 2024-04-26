import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AddAppointment from "./screens/AddAppointment"
import Doctors from "./screens/Doctors";
import AddDoctor from "./components/AddDoctor";
import AddDependentUser from './components/AddDependentUser'
import {Props} from "@react-navigation/stack/lib/typescript/src/views/Header/HeaderContainer";
import {StackNavigationProp} from "@react-navigation/stack";

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Account: { session: Session | null };
  Appointments: { session: Session | null };
  EditAccount: {session: Session | null};
  AddAppointment: {session: Session | null};
  AddDoctor: {session: Session | null};
  Doctors: {session: Session | null};
};



const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null)

  const Stack = createNativeStackNavigator<RootStackParamList>();

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
                <Stack.Screen name="Login" component={LoginScreen}/>
                <Stack.Screen name="Register" component={Register} />
              </>
          ) : (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Account"
                              component={Account}
                              initialParams={{session: session}}
                />
                <Stack.Screen name="Appointments"
                              component={Appointments}
                              initialParams={{session: session}}
                />
                <Stack.Screen name="EditAccount"
                              component={EditAccount}
                              initialParams={{session: session}}
                />
                <Stack.Screen name="AddAppointment"
                              component={AddAppointment}
                              initialParams={{session: session}}
                />
                <Stack.Screen name="Doctors"
                              component={Doctors}
                              initialParams={{session: session}}
                />
                <Stack.Screen name="AddDoctor"
                              component={AddDoctor}
                              initialParams={{session: session}}
                />
              </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;