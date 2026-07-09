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
    <LinearGradient colors={["#2563eb", "#1e40af"]} style={styles.container}>
      <View style={styles.iconWrap}>
        <View style={styles.iconCircle}>
          <Ionicons name="search" size={48} color="#fff" />
        </View>
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>FoundIt</Text>
        <Text style={styles.tagline}>
          Find what's lost.{"\n"}Return what's found.
        </Text>
      </View>

      <View style={styles.buttonWrap}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.push("/signup")}
        >
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.push("/login")}
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
    paddingHorizontal: 28,
    paddingTop: height * 0.12,
    paddingBottom: 50,
  },
  iconWrap: { alignItems: "center" },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  textWrap: { alignItems: "center" },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 17,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
  },
  buttonWrap: { gap: 12 },
  primaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
  },
  primaryBtnText: { color: "#2563eb", fontSize: 16, fontWeight: "700" },
  secondaryBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.4)",
  },
  secondaryBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
