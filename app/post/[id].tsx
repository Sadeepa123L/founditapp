import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { createClaim } from "../../src/services/claimService";
import { db } from "../../src/services/firebase";
import { deletePost, updatePost } from "../../src/services/postService";
import { Post } from "../../src/types/Post";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    const unsubscribe = onSnapshot(doc(db, "posts", id), (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...(docSnap.data() as Omit<Post, "id">) });
      } else {
        setPost(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>Post not found.</Text>
      </View>
    );
  }

  const isOwner = user?.uid === post.postedBy;

  const handleClaim = async () => {
    if (!user) return;
    try {
      await createClaim({
        postId: post.id,
        postTitle: post.title,
        postOwnerId: post.postedBy,
        claimerId: user.uid,
        claimerEmail: user.email || "",
        message: claimMessage,
      });
      setClaimModalVisible(false);
      setClaimMessage("");
      Alert.alert("Success", "Claim request sent!");
    } catch (e) {
      Alert.alert("Error", "Failed to send claim request.");
    }
  };

  const handleMarkResolved = async () => {
    await updatePost(post.id, { status: "resolved" });
  };

  const handleDelete = () => {
    Alert.alert("Delete post?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePost(post.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>‹ Back</Text>
      </TouchableOpacity>

      {post.photoUrl ? (
        <Image source={{ uri: post.photoUrl }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]}>
          <Text style={{ color: "#999" }}>No photo</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.badgeRow}>
          <Text
            style={[
              styles.badge,
              post.type === "lost" ? styles.badgeLost : styles.badgeFound,
            ]}
          >
            {post.type.toUpperCase()}
          </Text>
          <Text style={styles.status}>{post.status}</Text>
        </View>

        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.location}>📍 {post.location}</Text>
        <Text style={styles.category}>Category: {post.category}</Text>
        <Text style={styles.description}>{post.description}</Text>
        <Text style={styles.postedBy}>Posted by {post.postedByEmail}</Text>

        {isOwner ? (
          <View style={styles.ownerActions}>
            {post.status !== "resolved" && (
              <TouchableOpacity
                style={styles.resolveBtn}
                onPress={handleMarkResolved}
              >
                <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.editBtn} 
              onPress={() => router.push(`/post/edit/${post.id}`)}
            >
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Delete Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nonOwnerActions}>
            {post.status !== "claimed" && post.status !== "resolved" && (
              <TouchableOpacity
                style={styles.claimBtn}
                onPress={() => setClaimModalVisible(true)}
              >
                <Text style={styles.claimBtnText}>Claim This Item</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      <Modal
        visible={claimModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setClaimModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request to Claim</Text>
            <Text style={styles.modalSubtitle}>
              Send a message to the owner to verify this is yours.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g., The keys have a blue keychain..."
              value={claimMessage}
              onChangeText={setClaimMessage}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setClaimModalVisible(false)}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalSubmitBtn]}
                onPress={handleClaim}
              >
                <Text style={styles.modalSubmitBtnText}>Send Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  backBtnText: { fontSize: 16, fontWeight: "600" },
  photo: { width: "100%", height: 280 },
  photoPlaceholder: {
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 20 },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: "hidden",
  },
  badgeLost: { backgroundColor: "#fee2e2", color: "#dc2626" },
  badgeFound: { backgroundColor: "#dcfce7", color: "#16a34a" },
  status: { fontSize: 13, color: "#999", textTransform: "capitalize" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  location: { fontSize: 15, color: "#666", marginBottom: 4 },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    textTransform: "capitalize",
  },
  description: { fontSize: 15, lineHeight: 22, marginBottom: 16 },
  postedBy: { fontSize: 13, color: "#999", marginBottom: 20 },
  ownerActions: { flexDirection: "row", marginTop: 24, gap: 12 },
  nonOwnerActions: { marginTop: 24 },
  resolveBtn: {
    flex: 1,
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  resolveBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  editBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#dc2626",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  claimBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  claimBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  modalSubtitle: { fontSize: 14, color: "#666", marginBottom: 16 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 24,
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCancelBtn: { backgroundColor: "#f3f4f6" },
  modalCancelBtnText: { color: "#374151", fontWeight: "600" },
  modalSubmitBtn: { backgroundColor: "#2563eb" },
  modalSubmitBtnText: { color: "#fff", fontWeight: "600" },
});
