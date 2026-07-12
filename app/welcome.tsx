import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={["#4F46E5", "#8B5CF6", "#C084FC"]} style={styles.container}>
      <View style={styles.contentWrap}>
        <View style={styles.glassCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="compass-outline" size={56} color="#fff" />
          </View>
          <Text style={styles.title}>FoundIt</Text>
          <Text style={styles.tagline}>
            Find what's lost.{"\n"}Return what's found.
          </Text>
        </View>
      </View>

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/signup")}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/login")}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: height * 0.15,
    paddingBottom: 60,
  },
  contentWrap: { alignItems: "center" },
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 32,
    padding: 40,
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "500",
  },
  buttonWrap: { gap: 16 },
  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
  primaryBtnText: { color: "#4F46E5", fontSize: 18, fontWeight: "800" },
  secondaryBtn: {
    paddingVertical: 18,
    borderRadius: 999,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  secondaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
