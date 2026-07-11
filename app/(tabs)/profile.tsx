import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarText}>
            {user?.email ? user.email[0].toUpperCase() : "U"}
          </Text>
        </View>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.uid}>UID: {user?.uid}</Text>

        <TouchableOpacity 
          style={styles.inboxBtn} 
          onPress={() => router.push("/claims-inbox")}
        >
          <Text style={styles.inboxText}>View Claims Inbox</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: { fontSize: 36, color: "#fff", fontWeight: "bold" },
  email: { fontSize: 18, fontWeight: "600", color: "#111", marginBottom: 4 },
  uid: { fontSize: 12, color: "#9ca3af", marginBottom: 32 },
  inboxBtn: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  inboxText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
