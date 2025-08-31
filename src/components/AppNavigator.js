import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import AuthScreen from "../screens/AuthScreen";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import HistoryScreen from "../screens/HistoryScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Bienvenida") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Reservar") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Historial") {
            iconName = focused ? "list" : "list-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Bienvenida" component={WelcomeScreen} />
      <Tab.Screen name="Reservar" component={BookAppointmentScreen} />
      <Tab.Screen name="Historial" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
