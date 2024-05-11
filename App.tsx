import {useState, useEffect, useRef} from 'react'
import { supabase } from './lib/supabase'
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
import Appointments from "./screens/Appointments";
import EditAccount from "./screens/EditAccount";
import DependentUsers from "./screens/DependentUsers";
import Medication from "./screens/Medication";
import AddMedication from './screens/AddMedication'
import Calender from './screens/Calender';
import {NavigationContainer, RouteProp} from './node_modules/@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {StackNavigationProp} from "@react-navigation/stack";
import * as Animatable from 'react-native-animatable'
import 'react-native-reanimated'
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {backgroundColor} from "react-native-calendars/src/style";

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
  Calendar: {session : Session | null};
};


const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

type HomeTabsRouteProp = RouteProp<RootStackParamList, 'HomeTabs'>;
type HomeTabsNavigationProp= StackNavigationProp<RootStackParamList, 'HomeTabs'>;

type Props = {
  route: HomeTabsRouteProp;
  navigation: HomeTabsNavigationProp
};


// https://www.youtube.com/watch?v=XiutL0uLICg&list=PLhRhTJaArVFugDgTSvXTUaqJWY9Kpp-gV  tutorial de la bottomBar todo
function HomeTabs({route, navigation}: Props) {
  const {session} = route.params;
  const size = 38;
  const colorSelected = '#abd2a8';
  const colorNot = '#000000';

  //para saber q tab esta seleccionada
  const [selectedTab, setSelectedTab] = useState<number | null>(0);
  const tabRefs = useRef<Array<TouchableOpacity | null>>([]);
  useEffect(() => {
    if (selectedTab !== null) {
      console.log('Selected tab:', selectedTab);
    }
  }, [selectedTab]);
  const handleTabPress = (index : number) => {
    setSelectedTab(index);
  };

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
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 80,
            position: "absolute",
            bottom: 16,
            right: 16,
            left: 16,
            borderRadius: 10,
            backgroundColor: '#ECECEC',
          },
        }}
      >
        <Tab.Screen name="Home"
                    component={Home}
                    initialParams={{session: session}}
                    options={{title: '', headerShown: false, tabBarIcon:({color})=>(
                        <MaterialCommunityIcons/>
                    ), tabBarButton: (props) => (
                              <TouchableOpacity
                                  style={styles.container}
                                  onPress={() => {
                                    handleTabPress(0);
                                    navigation.navigate({ name: 'Home', params: { session: session } });
                                  }}
                                  ref={(ref) => (tabRefs.current[0] = ref)}
                              >
                                  <Animatable.View
                                      ref={viewRef0}
                                      duration={1000}>
                                      <MaterialCommunityIcons name="home" size={size} color={selectedTab==0 ? 'black' : 'grey'}/>
                                  </Animatable.View>
                              </TouchableOpacity>
                          ),}}/>
        <Tab.Screen name="Calendar"
                    component={Calender}
                    initialParams={{session: session}}
                    options={{title: '', headerShown: false, tabBarIcon:({color})=>(
                          <MaterialCommunityIcons/>
                    ), tabBarButton: (props) =>(
                          <TouchableOpacity
                              style={styles.container}
                              onPress={() => {
                                handleTabPress(1);
                                navigation.navigate({ name: 'Calendar', params: { session: session } });
                              }}
                              ref={(ref) => (tabRefs.current[1] = ref)}
                          >
                              <Animatable.View
                                  style={styles.container}
                                  ref={viewRef1}
                                  duration={1000}>
                                <MaterialCommunityIcons name="calendar" size={size} color={selectedTab==1 ? 'black' : 'grey'} />
                              </Animatable.View>
                          </TouchableOpacity>
                      ),}}
        />
        <Tab.Screen name="DependentUsers"
                    component={DependentUsers}
                    initialParams={{session: session}}
                    options={{title: '', headerShown: false, tabBarIcon:({color})=>(
                          <MaterialCommunityIcons/>
                    ), tabBarButton: (props) =>(
                          <TouchableOpacity
                              style={styles.container}
                              onPress={() => {
                                handleTabPress(2);
                                navigation.navigate({ name: 'DependentUsers', params: { session: session } });
                              }}
                              ref={(ref) => (tabRefs.current[3] = ref)}
                          >
                              <Animatable.View
                                  style={styles.container}
                                  ref={viewRef2}
                                  duration={1000}>
                                <MaterialCommunityIcons name="account-multiple-outline" size={size} color={selectedTab==2 ? 'black' : 'grey'}/>
                              </Animatable.View>
                          </TouchableOpacity>
                      ),}}
        />
        <Tab.Screen name="Account"
                    component={Account}
                    initialParams={{session: session}}
                    options={{title: '', headerShown: false, tabBarIcon:({color})=>(
                          <MaterialCommunityIcons/>
                    ), tabBarButton: (props) =>(
                          <TouchableOpacity
                              style={styles.container}
                              onPress={() => {
                                handleTabPress(3);
                                navigation.navigate({ name: 'Account', params: { session: session } });
                              }}
                              ref={(ref) => (tabRefs.current[3] = ref)}
                          >
                              <Animatable.View
                                  style={styles.container}
                                  ref={viewRef3}
                                  duration={1000}>
                                <MaterialCommunityIcons name="account" size={size} color={selectedTab==3 ? 'black' : 'grey'}/>
                              </Animatable.View>
                          </TouchableOpacity>
                      ),}}
        />
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
                <Stack.Screen name="Login"
                              component={LoginScreen}
                              initialParams={{session: session}}
                              options={{ headerShown: false }}
                />
                <Stack.Screen name="Register"
                              component={Register}
                              options={{
                                title: '',
                                headerStyle: {
                                  backgroundColor: '#2e5829',
                                },
                                headerTintColor: '#abd2a8',
                                headerBackTitle: 'Iniciar Sesión', // Cambia la etiqueta del botón de retroceso
                                }}/>
              </>
          ) : (
              <>
                <Stack.Screen name="HomeTabs"
                              component={HomeTabs}
                              initialParams={{session: session}}
                              options={{ headerShown: false }}/>
                <Stack.Screen name="AddAppointment"
                              component={AddAppointment}
                              initialParams={{session: session}}
                              options={{
                                title: '',
                                headerStyle: {
                                  backgroundColor: '#2e5829',
                                },
                                headerTintColor: '#abd2a8',
                                headerBackTitle: 'Volver',
                              }}/>
                <Stack.Screen name="AddDoctor"
                              component={AddDoctor}
                              initialParams={{session: session}}
                              options={{
                                title: '',
                                headerStyle: {
                                    backgroundColor: '#2e5829',
                                },
                                headerTintColor: '#abd2a8',
                                headerBackTitle: 'Doctores',
                              }}/>
                <Stack.Screen name="AddDependentUser"
                              component={AddDependentUser}
                              initialParams={{session: session}}
                              options={{
                                title: '',
                                  headerStyle: {
                                      backgroundColor: '#2e5829',
                                  },
                                headerTintColor: '#abd2a8',
                                headerBackTitle: 'Usuario Dependiente',
                              }}/>
                <Stack.Screen name="AddMedication"
                              component={AddMedication}
                              initialParams={{session: session}}
                              options={{
                                title: '',
                                  headerStyle: {
                                      backgroundColor: '#2e5829',
                                  },
                                headerTintColor: '#abd2a8',
                                headerBackTitle: 'Medicamentos',
                              }}/>
                <Stack.Screen name="Appointments"
                              component={Appointments}
                              initialParams={{session: session}}
                              options={{
                                title: '',
                                  headerStyle: {
                                      backgroundColor: '#2e5829',
                                  },
                                headerTintColor: '#abd2a8',
                                headerBackTitle: 'Volver',
                              }}/>
                 <Stack.Screen name="Doctors"
                               component={Doctors} initialParams={{session: session}}
                               options={{
                                 title: '',
                                   headerStyle: {
                                       backgroundColor: '#2e5829',
                                   },
                                 headerTintColor: '#abd2a8',
                                 headerBackTitle: 'Perfil',
                               }}/>
                <Stack.Screen name="EditAccount"
                                component={EditAccount}
                                initialParams={{session: session}}
                                options={{
                                    title: '',
                                    headerStyle: {
                                        backgroundColor: '#2e5829',
                                    },
                                    headerTintColor: '#abd2a8',
                                    headerBackTitle: 'Perfil',
                                }}/>
                  <Stack.Screen name="Medication"
                                component={Medication}
                                initialParams={{session: session}}
                                options={{
                                  title: '',
                                    headerStyle: {
                                        backgroundColor: '#2e5829',
                                    },
                                  headerTintColor: '#abd2a8',
                                  headerBackTitle: 'Perfil',
                                }}/>
              </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  }
})