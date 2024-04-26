import Home from './Home';
import Doctors from "./Doctors";
import Appointments from "../components/Appointments";
import Account from "../components/Account";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View} from "react-native";
import {Icon} from "react-native-elements";
import {Session} from "@supabase/supabase-js";
import React, {useEffect, useState} from "react";
import {supabase} from "../lib/supabase";
import Auth from "../components/Auth";
import Register from "./Register";

const Tab = createBottomTabNavigator()

export default function BottomBar() {
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
            <Tab.Navigator screenOptions={{
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 60,
                },
            }}>
                <Tab.Screen name="Home" component={Home}
                options={{
                    tabBarIcon: ({focused}) =>{
                        return (
                            <View style={{ alignItems: "center", justifyContent: "center"}}>
                                <Icon name="home-outline" type="ionicon" />
                            </View>
                            )
                }}}/>
                {!session ? (
                    <>
                        <Text>Hola probando, no iniciaste sesion</Text>
                    </>
                ) : (
                    <>
                        <Tab.Screen name="Docs" component={() => <Doctors session={session} />}
                                    options={{
                                        tabBarIcon: ({focused}) =>{
                                            return (
                                                <View style={{ alignItems: "center", justifyContent: "center"}}>
                                                    <Icon name="home-outline" type="ionicon" />
                                                </View>
                                            )
                                        }}}/>
                        <Tab.Screen name="Turnos" component={ () => <Appointments session={session}/>}
                                    options={{
                                        tabBarIcon: ({focused}) =>{
                                            return (
                                                <View style={{ alignItems: "center", justifyContent: "center"}}>
                                                    <Icon name="home-outline" type="ionicon" />
                                                </View>
                                            )
                                        }}}/>
                        <Tab.Screen name="Ajustes" component={() => <Account session={session}/>}
                                    options={{
                                        tabBarIcon: ({focused}) =>{
                                            return (
                                                <View style={{ alignItems: "center", justifyContent: "center"}}>
                                                    <Icon name="home-outline" type="ionicon" />
                                                </View>
                                            )
                                        }}}/>
                    </>
                )}
            </Tab.Navigator>
        </NavigationContainer>
    )
}