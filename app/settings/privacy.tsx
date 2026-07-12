import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PrivacyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy & Terms</Text>
        <Text style={styles.lastUpdated}>Last Updated: October 2023</Text>

        <Text style={styles.sectionTitle}>1. Data Collection</Text>
        <Text style={styles.paragraph}>
          We collect the minimum amount of data required to provide our service. This includes your email address for authentication, and the location data you voluntarily provide when creating a post. We do not sell your data to third parties.
        </Text>

        <Text style={styles.sectionTitle}>2. Location Data</Text>
        <Text style={styles.paragraph}>
          When you use the "Current Location" feature to create a post, we access your device's GPS coordinates only for that specific action. We do not track your location in the background.
        </Text>

        <Text style={styles.sectionTitle}>3. Messaging</Text>
        <Text style={styles.paragraph}>
          Our in-app chat is designed to keep your personal contact information private. We monitor chats strictly for safety and abuse prevention. Do not share sensitive personal information (like your Social Security Number or banking details) in the chat.
        </Text>

        <Text style={styles.sectionTitle}>4. Account Deletion</Text>
        <Text style={styles.paragraph}>
          You have the right to delete your account at any time via the Profile settings. Deleting your account will permanently remove all your posts and messages from our active databases.
        </Text>
        
        <View style={{ height: 40 }} />
      </ScrollView>
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
  title: { fontSize: 28, fontWeight: "900", color: "#F8FAFC", marginBottom: 8 },
  lastUpdated: { fontSize: 14, color: "#64748B", marginBottom: 32, fontWeight: "600" },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#6366F1", marginBottom: 12, marginTop: 8 },
  paragraph: { fontSize: 15, color: "#94A3B8", lineHeight: 24, marginBottom: 24 },
});
