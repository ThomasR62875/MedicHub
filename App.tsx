import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import { Session } from '@supabase/supabase-js'
import React from 'react';
import {NavigationContainer, RouteProp} from '@react-navigation/native';
import AddAppointment from "./screens/AddAppointment"
import LoginScreen from "./screens/LogIn";
import Doctors from "./screens/Doctors";
import AddDoctor from "./screens/AddDoctor";
import AddDependentUser from './screens/AddDependentUser'
import Account from "./screens/Account";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Register from "./screens/Register";
import Home from "./screens/Home";
import Appointments from "./screens/Appointments";
import EditAccount from "./screens/EditAccount";
import DependentUsers from "./screens/DependentUsers";
import Medication from "./screens/Medication";
import AddMedication from './screens/AddMedication'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {StackNavigationProp} from "@react-navigation/stack";

export type RootStackParamList = {
  HomeTabs: { session: Session | null };
  Home: { session: Session | null };
  Login: {session: Session | null};
  Register: undefined;
  Account: { session: Session | null };
  Appointments: { session: Session | null };
  EditAccount: {session: Session | null};
  AddAppointment: {session: Session | null};
  AddDoctor: {session: Session | null};
  Doctors: {session: Session | null};
  DependentUsers: {session: Session | null};
  AddDependentUser: {session: Session | null};
    Medication: {session: Session | null};
    AddMedication: {session: Session | null};
};


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type HomeTabsRouteProp = RouteProp<RootStackParamList, 'HomeTabs'>;
type HomeTabsNavigationProp= StackNavigationProp<RootStackParamList, 'HomeTabs'>;

type Props = {
  route: HomeTabsRouteProp;
  navigation: HomeTabsNavigationProp
};


function HomeTabs({route}: Props) {
  const {session} = route.params;
  return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={Home} initialParams={{session: session}}/>
        <Tab.Screen name="Appointments" component={Appointments} initialParams={{session: session}}/>
        <Tab.Screen name="Medication" component={Medication} initialParams={{session: session}}/>
        <Tab.Screen name="Doctors" component={Doctors} initialParams={{session: session}}/>
      </Tab.Navigator>
  );
}


const App = () => {
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
                <Stack.Screen name="Login" component={LoginScreen} initialParams={{session: session}} />
                <Stack.Screen name="Register" component={Register} />
              </>
          ) : (
              <>
                <Stack.Screen name="HomeTabs" component={HomeTabs} initialParams={{session: session}} />
                <Stack.Screen name="Account" component={Account} initialParams={{session: session}} />
                <Stack.Screen name="EditAccount" component={EditAccount} initialParams={{session: session}} />
                <Stack.Screen name="AddAppointment" component={AddAppointment} initialParams={{session: session}} />
                <Stack.Screen name="AddDoctor" component={AddDoctor} initialParams={{session: session}} />
                <Stack.Screen name="DependentUsers" component={DependentUsers} initialParams={{session: session}} />
                <Stack.Screen name="AddDependentUser" component={AddDependentUser} initialParams={{session: session}} />
                <Stack.Screen name="AddMedication" component={AddMedication} initialParams={{session: session}} />
              </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;