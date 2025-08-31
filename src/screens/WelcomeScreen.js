import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";

const WelcomeScreen = ({ navigation }) => {
  const handleLogout = async () => {
    await auth.signOut();
    navigation.replace("Auth");
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
      <View style={styles.container}>
        <Image source={require("../../assets/icon.png")} style={styles.logo} />
        <Text style={styles.title}>¡Bienvenido!</Text>
        <Text style={styles.subtitle}>¿Qué deseas hacer?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Reservar")}
        >
          <Text style={styles.buttonText}>Reservar Cita</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Historial")}
        >
          <Text style={styles.buttonText}>Ver Historial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.logout]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#007AFF",
    textShadowColor: "#b0c4de",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 15,
    width: "80%",
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 1,
  },
  logout: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },
});

export default WelcomeScreen;
