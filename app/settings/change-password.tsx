import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function ChangePasswordScreen() {
  const { updateUserPassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(newPassword);
      Alert.alert("Success", "Password updated successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error: any) {
      if (error.code === "auth/requires-recent-login") {
        Alert.alert("Authentication Required", "Please log out and log back in before changing your password.");
      } else {
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity 
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.btnText}>{loading ? "Updating..." : "Update Password"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#0F172A",
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTitle: { fontSize: 24, fontWeight: "900", color: "#F8FAFC" },
  content: { padding: 24 },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#94A3B8",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: "#F8FAFC",
    marginBottom: 24,
  },
  btn: {
    backgroundColor: "#6366F1",
    padding: 18,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  btnDisabled: {
    backgroundColor: "#475569",
    shadowOpacity: 0,
  },
  btnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
});
