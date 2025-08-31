import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Tu configuración de Firebase (reemplaza con tus datos)
const firebaseConfig = {
  apiKey: "AIzaSyBHWJD312zwosuPOjBF4b2-zqWC0CRoup8",
  authDomain: "citas-3ecd8.firebaseapp.com",
  projectId: "citas-3ecd8",
  storageBucket: "citas-3ecd8.firebasestorage.app",
  messagingSenderId: "594709763187",
  appId: "1:594709763187:web:ecc01f9be240d40616c606",
  measurementId: "G-TG6LPES37E",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
const db = getFirestore(app);

export { auth, db };
