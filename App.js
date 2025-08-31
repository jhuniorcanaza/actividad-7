import React, { useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/components/AppNavigator';

// Configurar el manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Solicitar permisos para notificaciones
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para las notificaciones');
      }
    };

    requestPermissions();

    // Escuchar notificaciones recibidas en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificación recibida:', notification);
    });

    // Escuchar respuestas a notificaciones
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuario interactuó con la notificación:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return <AppNavigator />;
}