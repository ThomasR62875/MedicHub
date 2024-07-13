import { useState, useEffect, useRef } from 'react'
import { supabase} from './lib/supabase'
import { Session } from '@supabase/supabase-js'
import React from 'react';
import AddAppointment from "./screens/AddAppointment"
import LoginScreen from "./screens/LogIn";
import Doctors from "./screens/Doctors";
import AddDoctor from "./screens/AddDoctor";
import AddDependentUser from './screens/AddDependentUser'
import Account from "./screens/Account";
import Register from "./screens/Register";
import Home from "./screens/Home";
import EditAccount from "./screens/EditAccount";
import SingleAppointment from "./screens/SingleAppointment";
import EditAppointment from "./screens/EditAppointment";
import SingleMedication from "./screens/SingleMedication";
import EditMedication from "./screens/EditMedication";
import SingleDependentUser from "./screens/SingleDependentUser";
import EditDependentUser from "./screens/EditDependentUser";
import SingleDoctor from "./screens/SingleDoctor";
import EditDoctor from "./screens/EditDoctor";
import DependentUsers from "./screens/DependentUsers";
import Medications from "./screens/Medication";
import AddMedication from './screens/AddMedication'
import Calender from './screens/Calender';
import AlertPublicity from "./screens/AlertPublicity";
import {NavigationContainer, RouteProp} from './node_modules/@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {StackNavigationProp} from "@react-navigation/stack";
import 'react-native-reanimated'
import * as Animatable from 'react-native-animatable'
import 'react-native-reanimated'
import {Ionicons} from "@expo/vector-icons";
import {StatusBar} from "react-native";
import {useTranslation} from "react-i18next";
import { Provider } from 'react-native-paper';

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
  Medications: {session: Session | null};
  AddMedication: {session: Session | null};
  Calendar: {session : Session | null};
  SingleAppointment: {session : Session | null};
  EditAppointment: {session : Session | null};
  SingleMedication: {session : Session | null};
  EditMedication: {session : Session | null};
  SingleDoctor: {session : Session | null};
  EditDoctor: {session : Session | null};
  SingleDependentUser: {session : Session | null};
  EditDependentUser: {session : Session | null};
  AlertPublicity: {session : Session | null, msg: string, screen: string, appointment: Appointment | null , du: DependentUser | null, doc: Doctor | null, meds: Medication | null};
};

import { AppRegistry } from 'react-native';
import {Appointment, DependentUser, Doctor, Medication} from "./lib/types";
AppRegistry.registerComponent('main', () => App);

const Tab = createBottomTabNavigator();

type HomeTabsRouteProp = RouteProp<RootStackParamList, 'HomeTabs'>;
type HomeTabsNavigationProp= StackNavigationProp<RootStackParamList, 'HomeTabs'>;

type Props = {
  route: HomeTabsRouteProp;
  navigation: HomeTabsNavigationProp
};


// https://www.youtube.com/watch?v=XiutL0uLICg&list=PLhRhTJaArVFugDgTSvXTUaqJWY9Kpp-gV  tutorial de la bottomBar todo
function HomeTabs({route}: Props) {
  const {session} = route.params;
  const {t} = useTranslation();

  //para saber q tab esta seleccionada
  const [selectedTab] = useState<number | null>(0);
  useEffect(() => {
    if (selectedTab !== null) {
      console.log('Selected tab:', selectedTab);
    }
  }, [selectedTab]);


  //cosas de animation
    const viewRef0 = useRef<Animatable.View | null>(null);
    useEffect(() => {
        if (viewRef0.current) {
            if (selectedTab==0) {
                viewRef0.current.animate({ 0: { scaleX: .5, transform: [{ rotate: '0deg' }] }, 1: { scaleX: 1.5, transform: [{ rotate: '360deg' }] } });
            }
        }
    }, )
    const viewRef1 = useRef<Animatable.View | null>(null);
    useEffect(() => {
        if (viewRef1.current) {
            if (selectedTab==1) {
                viewRef1.current.animate({ 0: { scaleX: .5, transform: [{ rotate: '0deg' }] }, 1: { scaleX: 1.5, transform: [{ rotate: '360deg' }] } });
            }
        }
    }, )
    const viewRef2 = useRef<Animatable.View | null>(null);
    useEffect(() => {
        if (viewRef2.current) {
            if (selectedTab==2) {
                viewRef2.current.animate({ 0: { scaleX: .5, transform: [{ rotate: '0deg' }] }, 1: { scaleX: 1.5, transform: [{ rotate: '360deg' }] } });
            }
        }
    }, )
    const viewRef3 = useRef<Animatable.View | null>(null);
    useEffect(() => {
        if (viewRef3.current) {
            if (selectedTab==3) {
                viewRef3.current.animate({ 0: { scaleX: .5, transform: [{ rotate: '0deg' }] }, 1: { scaleX: 1.5, transform: [{ rotate: '360deg' }] } });
            }
        }
    }, )

    return (
        <Tab.Navigator screenOptions={{
            tabBarStyle: {backgroundColor: "#ffffff", borderRadius:30, padding: 10, position: 'absolute', borderColor: '#d5d4d4', borderWidth: 1},
            tabBarActiveTintColor: "#8b86be",
            tabBarInactiveTintColor: "#ababab",
        }}>
            <Tab.Screen
                name={t('home')}
                component={Home}
                initialParams={{session: session}}
                options={{
                    title: t('home'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" color={color} size={size} />
                    ),
                    headerShown: false
                }}
            />
            <Tab.Screen
                name={t('calendar')}
                component={Calender}
                initialParams={{session: session}}
                options={{
                    title: t('calendar'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="calendar" color={color} size={size} />
                    ),
                    headerShown: false
                }
                }
            />
            <Tab.Screen
                name={t('dusers')}
                component={DependentUsers}
                initialParams={{session: session}}
                options={{
                    title: t('dusers'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" color={color} size={size} />
                    ),
                    headerShown: false
                }}/>
            <Tab.Screen
                name={t('account')}
                component={Account}
                initialParams={{session: session}}
                options={{
                    title: t('account'),
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" color={color} size={size} />
                    ),
                    headerShown: false
                }}/>
        </Tab.Navigator>
  );
}


const App = () => {
  const [session, setSession] = useState<Session | null>(null)

  const Stack = createNativeStackNavigator<RootStackParamList>();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

  }, []);


  return (
      <Provider>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" />
          <NavigationContainer>
            <Stack.Navigator>
              {!session ? (
                  <>
                    <Stack.Screen name="Login"
                                  component={LoginScreen}
                                  initialParams={{session: session}}
                                  options={{ headerShown: false }}
                    />
                    <Stack.Screen name="Register"
                                  component={Register}
                                  options={{
                                    title: '',headerShown: false
                                    }}/>
                  </>
              ) : (
                  <>
                    <Stack.Screen name="HomeTabs"
                                  component={HomeTabs}
                                  initialParams={{session: session}}
                                  options={{ headerShown: false}}/>
                    <Stack.Screen name="AlertPublicity"
                                component={AlertPublicity}
                                initialParams={{session: session, msg: 'successful addition', screen: 'Home'}}
                                options={{
                                    title: '',
                                    headerStyle: {
                                        backgroundColor: '#2E5829',
                                    },
                                    headerTintColor: '#2E5829',
                                }}/>
                    <Stack.Screen name="AddAppointment"
                                  component={AddAppointment}
                                  initialParams={{session: session}}
                                  options={{ headerShown: false }}/>
                      <Stack.Screen name="SingleAppointment"
                                    component={SingleAppointment}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                      <Stack.Screen name="EditAppointment"
                                    component={EditAppointment}
                                    initialParams={{session: session}}
                                    options={{
                                        title: '',
                                        headerStyle: {
                                            backgroundColor: '#2E5829',
                                        },
                                        headerTintColor: '#ABD2A8',
                                        headerBackTitle: 'Volver',
                                    }}/>
                    <Stack.Screen name="AddDoctor"
                                  component={AddDoctor}
                                  initialParams={{session: session}}
                                  options={{ headerShown: false }}/>
                      <Stack.Screen name="SingleDoctor"
                                    component={SingleDoctor}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                      <Stack.Screen name="EditDoctor"
                                    component={EditDoctor}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                    <Stack.Screen name="AddDependentUser"
                                  component={AddDependentUser}
                                  initialParams={{session: session}}
                                  options={{ headerShown: false }}/>
                      <Stack.Screen name="SingleDependentUser"
                                    component={SingleDependentUser}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                      <Stack.Screen name="EditDependentUser"
                                    component={EditDependentUser}
                                    initialParams={{session: session}}
                                    options={{
                                        title: '',
                                        headerStyle: {
                                            backgroundColor: '#2E5829',
                                        },
                                        headerTintColor: '#ABD2A8',
                                        headerBackTitle: 'Volver',
                                    }}/>
                    <Stack.Screen name="AddMedication"
                                  component={AddMedication}
                                  initialParams={{session: session}}
                                  options={{
                                    title: '',
                                      headerStyle: {
                                          backgroundColor: '#2E5829',
                                      },
                                    headerTintColor: '#ABD2A8',
                                    headerBackTitle: 'Medicamentos',
                                  }}/>
                      <Stack.Screen name="SingleMedication"
                                    component={SingleMedication}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                      <Stack.Screen name="EditMedication"
                                    component={EditMedication}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                     <Stack.Screen name="Doctors"
                                   component={Doctors} initialParams={{session: session}}
                                   options={{ headerShown: false }}/>
                    <Stack.Screen name="EditAccount"
                                    component={EditAccount}
                                    initialParams={{session: session}}
                                    options={{
                                        title: '',
                                        headerStyle: {
                                            backgroundColor: '#2E5829',
                                        },
                                        headerTintColor: '#ABD2A8',
                                        headerBackTitle: 'Perfil',
                                    }}/>
                      <Stack.Screen name="Medications"
                                    component={Medications}
                                    initialParams={{session: session}}
                                    options={{ headerShown: false }}/>
                  </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
      </Provider>
  );
}

export default App;
