import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/context/AuthContext";

export default function ProfileScreen() {
  const { user, logout, deleteUserAccount } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: logout },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. You may need to log in again to verify your identity.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteUserAccount();
            } catch (error: any) {
              if (error.code === "auth/requires-recent-login") {
                Alert.alert("Authentication Required", "Please log out and log back in to delete your account.");
              } else {
                Alert.alert("Error", error.message);
              }
            }
          },
        },
      ]
    );
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      Alert.alert("Theme", "Light mode is currently under construction. Stay tuned!");
    } else {
      setIsDarkMode(true);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4F46E5", "#8B5CF6"]} style={styles.banner}>
        <View style={styles.bannerHeader}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.userInfo}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>
              {user?.email ? user.email[0].toUpperCase() : "U"}
            </Text>
          </View>
          <Text style={styles.email}>{user?.email}</Text>
          <Text style={styles.uid}>UID: {user?.uid}</Text>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuBox}>
            <View style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: "rgba(168, 85, 247, 0.2)" }]}>
                <Ionicons name="moon" size={18} color="#A855F7" />
              </View>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Switch 
                value={isDarkMode} 
                onValueChange={toggleTheme}
                trackColor={{ false: "#334155", true: "#6366F1" }}
                thumbColor="#F8FAFC"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuBox}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push("/settings/change-password")}
            >
              <View style={[styles.menuIcon, { backgroundColor: "rgba(99, 102, 241, 0.2)" }]}>
                <Ionicons name="lock-closed" size={18} color="#6366F1" />
              </View>
              <Text style={styles.menuText}>Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>
            
            <View style={styles.divider} />

            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
              <View style={[styles.menuIcon, { backgroundColor: "rgba(239, 68, 68, 0.2)" }]}>
                <Ionicons name="trash" size={18} color="#EF4444" />
              </View>
              <Text style={[styles.menuText, { color: "#EF4444" }]}>Delete Account</Text>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.menuBox}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push("/settings/safety")}
            >
              <View style={[styles.menuIcon, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                <Ionicons name="shield-checkmark" size={18} color="#10B981" />
              </View>
              <Text style={styles.menuText}>Safety Guidelines</Text>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => router.push("/settings/privacy")}
            >
              <View style={[styles.menuIcon, { backgroundColor: "rgba(245, 158, 11, 0.2)" }]}>
                <Ionicons name="document-text" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  banner: {
    paddingTop: 60,
    paddingBottom: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  bannerHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  headerTitle: { fontSize: 34, fontWeight: "900", color: "#FFFFFF", letterSpacing: -1 },
  userInfo: {
    alignItems: "center",
  },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    marginBottom: 12,
  },
  avatarText: { fontSize: 44, color: "#fff", fontWeight: "900" },
  email: { fontSize: 20, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  uid: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  
  scrollContent: { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 40 },
  
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#64748B", marginBottom: 12, marginLeft: 12, textTransform: "uppercase" },
  menuBox: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuText: { flex: 1, fontSize: 16, color: "#F8FAFC", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#0F172A", marginLeft: 68 },
  
  logoutBtn: {
    flexDirection: "row",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 999,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.2)",
  },
  logoutText: { color: "#EF4444", fontSize: 16, fontWeight: "700" },
});
