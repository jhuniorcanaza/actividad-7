import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const HistoryScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editReason, setEditReason] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(
      collection(db, "appointments"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const saveEdit = async () => {
    if (!editReason.trim()) {
      Alert.alert("Error", "El motivo no puede estar vacío");
      return;
    }
    await updateDoc(doc(db, "appointments", editId), { reason: editReason });
    setEditModalVisible(false);
    setEditId(null);
    setEditReason("");
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setEditReason(item.reason);
    setEditModalVisible(true);
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Eliminar cita",
      "¿Estás seguro de que deseas eliminar esta cita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteDoc(doc(db, "appointments", id));
          },
        },
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentCard}>
      <Text style={styles.dateText}>
        {item.date?.toDate
          ? item.date.toDate().toLocaleString()
          : new Date(item.date).toLocaleString()}
      </Text>
      <Text style={styles.reasonText}>{item.reason}</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient colors={["#e0eafc", "#cfdef3"]} style={styles.gradient}>
        <View style={styles.container}>
          <Text style={styles.title}>Historial de Citas</Text>
          {appointments.length === 0 ? (
            <View style={styles.center}>
              <Text>No tienes citas programadas</Text>
            </View>
          ) : (
            <FlatList
              data={appointments}
              renderItem={renderAppointment}
              keyExtractor={(item) => item.id}
            />
          )}
          <Modal visible={editModalVisible} animationType="slide" transparent>
            <TouchableWithoutFeedback
              onPress={Keyboard.dismiss}
              accessible={false}
            >
              <View style={styles.modalBg}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Editar Motivo</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editReason}
                    onChangeText={setEditReason}
                    placeholder="Motivo de la cita"
                  />
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.editBtn} onPress={saveEdit}>
                      <Text style={styles.actionText}>Guardar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => setEditModalVisible(false)}
                    >
                      <Text style={styles.actionText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </LinearGradient>
    </TouchableWithoutFeedback>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  appointmentCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  editBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  actionText: {
    color: "white",
    fontWeight: "bold",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 15,
    width: "80%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  dateText: {
    fontWeight: "bold",
    marginBottom: 5,
  },

  reasonText: {
    color: "#666",
  },
});

export default HistoryScreen;
