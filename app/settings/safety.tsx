import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SafetyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Guidelines</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="shield-checkmark" size={64} color="#10B981" />
        </View>
        <Text style={styles.title}>Your Safety is Priority</Text>
        <Text style={styles.subtitle}>
          Please follow these best practices when meeting someone to return or claim a lost item.
        </Text>

        <View style={styles.ruleCard}>
          <Ionicons name="people" size={24} color="#6366F1" style={styles.ruleIcon} />
          <View style={styles.ruleTextWrap}>
            <Text style={styles.ruleTitle}>Meet in Public</Text>
            <Text style={styles.ruleDesc}>
              Always arrange to meet in a busy, well-lit public place such as a coffee shop, mall, or local police station lobby.
            </Text>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <Ionicons name="sunny" size={24} color="#F59E0B" style={styles.ruleIcon} />
          <View style={styles.ruleTextWrap}>
            <Text style={styles.ruleTitle}>Meet During the Day</Text>
            <Text style={styles.ruleDesc}>
              Avoid meeting at night or in secluded areas. Daylight provides better visibility and safety.
            </Text>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <Ionicons name="person-add" size={24} color="#EC4899" style={styles.ruleIcon} />
          <View style={styles.ruleTextWrap}>
            <Text style={styles.ruleTitle}>Bring a Friend</Text>
            <Text style={styles.ruleDesc}>
              If possible, do not go alone. Bring a friend or family member with you, or at least let someone know where you are going.
            </Text>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <Ionicons name="chatbubbles" size={24} color="#3B82F6" style={styles.ruleIcon} />
          <View style={styles.ruleTextWrap}>
            <Text style={styles.ruleTitle}>Keep Chat In-App</Text>
            <Text style={styles.ruleDesc}>
              Use our in-app messaging feature to coordinate. Do not give out your personal phone number or address.
            </Text>
          </View>
        </View>
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
  content: { padding: 24, alignItems: "center" },
  iconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontSize: 24, fontWeight: "900", color: "#F8FAFC", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#94A3B8", textAlign: "center", marginBottom: 40, lineHeight: 24 },
  ruleCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    width: "100%",
  },
  ruleIcon: { marginRight: 16, marginTop: 2 },
  ruleTextWrap: { flex: 1 },
  ruleTitle: { fontSize: 18, fontWeight: "800", color: "#F8FAFC", marginBottom: 6 },
  ruleDesc: { fontSize: 14, color: "#94A3B8", lineHeight: 22 },
});
