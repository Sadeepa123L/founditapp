import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Missing info", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await signup(email, password);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Signup failed", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={{ marginBottom: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to FoundIt</Text>
      <Text style={styles.subtitle}>Create an account to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="off"
        textContentType="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        autoComplete="off"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        autoComplete="off"
        textContentType="password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={submitting}
      >
        <Text style={styles.buttonText}>
          {submitting ? "Creating account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <Link href="/login" style={styles.link}>
        Already have an account? Log in
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#0F172A",
  },
  title: { fontSize: 32, fontWeight: "900", marginBottom: 8, color: "#F8FAFC", letterSpacing: -1 },
  subtitle: { fontSize: 16, color: "#94A3B8", marginBottom: 32, fontWeight: "500" },
  input: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    fontSize: 16,
    color: "#F8FAFC",
  },
  button: {
    backgroundColor: "#6366F1",
    borderRadius: 999,
    padding: 18,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  link: { marginTop: 24, textAlign: "center", color: "#6366F1", fontWeight: "600" },
});
