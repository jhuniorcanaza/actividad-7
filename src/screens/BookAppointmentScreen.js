import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import * as Notifications from "expo-notifications";

const BookAppointmentScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reason, setReason] = useState("");

  const scheduleNotification = async (appointmentDate) => {
    // Programar notificación 15 minutos antes de la cita
    const notificationTime = new Date(appointmentDate.getTime() - 15 * 60000);

    // Validar que la fecha sea futura
    if (notificationTime <= new Date()) {
      Alert.alert(
        "Error",
        "La notificación no puede programarse en el pasado."
      );
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Recordatorio de cita",
        body: `Tu cita está programada en 15 minutos. Motivo: ${reason}`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: { type: "date", date: notificationTime },
    });
  };

  const handleBookAppointment = async () => {
    try {
      if (!reason.trim()) {
        Alert.alert("Error", "Por favor ingresa un motivo para la cita");
        return;
      }

      const user = auth.currentUser;
      const appointmentData = {
        userId: user.uid,
        date: date,
        reason: reason,
        createdAt: serverTimestamp(),
      };

      // Guardar en Firestore
      const docRef = await addDoc(
        collection(db, "appointments"),
        appointmentData
      );

      // Programar notificación
      await scheduleNotification(date);

      Alert.alert("Éxito", "Cita reservada correctamente");
      setReason("");
      setDate(new Date());
      navigation.navigate("Historial");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.title}>Reservar Nueva Cita</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onChangeDate}
            minimumDate={new Date()}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Motivo de la cita"
          value={reason}
          onChangeText={setReason}
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.button} onPress={handleBookAppointment}>
          <Text style={styles.buttonText}>Reservar Cita</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  dateButton: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dateButtonText: {
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
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
});

export default BookAppointmentScreen;
