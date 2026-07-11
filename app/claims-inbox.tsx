import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";
import { subscribeToIncomingClaims, updateClaimStatus } from "../src/services/claimService";
import { Claim } from "../src/types/Claim";

export default function ClaimsInboxScreen() {
  const { user } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToIncomingClaims(
      user.uid,
      (updatedClaims) => {
        setClaims(updatedClaims);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching claims:", error);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [user]);

  const handleAccept = async (claim: Claim) => {
    await updateClaimStatus(claim.id, claim.postId, "accepted");
  };

  const handleReject = async (claim: Claim) => {
    await updateClaimStatus(claim.id, claim.postId, "rejected");
  };

  const renderItem = ({ item }: { item: Claim }) => (
    <View style={styles.claimCard}>
      <Text style={styles.postTitle}>Post: {item.postTitle}</Text>
      <Text style={styles.claimer}>Requested by: {item.claimerEmail}</Text>
      <Text style={styles.message}>"{item.message}"</Text>
      <Text style={styles.status}>Status: {item.status.toUpperCase()}</Text>

      {item.status === "pending" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.acceptBtn]}
            onPress={() => handleAccept(item)}
          >
            <Text style={styles.acceptBtnText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => handleReject(item)}
          >
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Claims Inbox</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : claims.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No claims yet.</Text>
        </View>
      ) : (
        <FlatList
          data={claims}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { marginRight: 16 },
  backBtnText: { fontSize: 16, fontWeight: "600", color: "#2563eb" },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  emptyText: { fontSize: 16, color: "#6b7280" },
  list: { padding: 16 },
  claimCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  postTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  claimer: { fontSize: 14, color: "#4b5563", marginBottom: 8 },
  message: { fontSize: 14, fontStyle: "italic", color: "#374151", marginBottom: 8 },
  status: { fontSize: 12, fontWeight: "bold", color: "#9ca3af", marginBottom: 12 },
  actionRow: { flexDirection: "row", gap: 12 },
  actionBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: "center" },
  acceptBtn: { backgroundColor: "#16a34a" },
  acceptBtnText: { color: "#fff", fontWeight: "600" },
  rejectBtn: { backgroundColor: "#ef4444" },
  rejectBtnText: { color: "#fff", fontWeight: "600" },
});
