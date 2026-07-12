import { router, useLocalSearchParams } from "expo-router";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { createOrGetRoom } from "../../src/services/chatService";
import { db } from "../../src/services/firebase";
import { deletePost, updatePost } from "../../src/services/postService";
import { Post } from "../../src/types/Post";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#F8FAFC" }}>Post not found.</Text>
      </View>
    );
  }

  const isOwner = user?.uid === post.postedBy;

  const handleMessageOwner = async () => {
    if (!user) return;
    try {
      const roomId = await createOrGetRoom(
        post.id,
        post.title,
        post.photoUrl || null,
        post.postedBy,
        post.postedByEmail,
        user.uid,
        user.email || "Unknown"
      );
      router.push(`/chat/${roomId}`);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Failed to start chat.");
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
          <Text style={{ color: "#64748B" }}>No photo</Text>
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
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.nonOwnerActions}>
            {post.status !== "resolved" && (
              <TouchableOpacity
                style={styles.claimBtn}
                onPress={handleMessageOwner}
              >
                <Text style={styles.claimBtnText}>Claim This Item</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 16,
    zIndex: 10,
    backgroundColor: "rgba(15,23,42,0.7)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backBtnText: { fontSize: 16, fontWeight: "600", color: "#F8FAFC" },
  photo: { width: "100%", height: 320, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  photoPlaceholder: {
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 24 },
  badgeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "center",
  },
  badge: {
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  badgeLost: { backgroundColor: "rgba(255, 77, 77, 0.2)", color: "#FF4D4D" },
  badgeFound: { backgroundColor: "rgba(16, 185, 129, 0.2)", color: "#10B981" },
  status: { fontSize: 13, color: "#94A3B8", textTransform: "uppercase", fontWeight: "700" },
  title: { fontSize: 28, fontWeight: "900", marginBottom: 12, color: "#F8FAFC", letterSpacing: -0.5 },
  location: { fontSize: 16, color: "#94A3B8", marginBottom: 6, fontWeight: "500" },
  category: {
    fontSize: 14,
    color: "#6366F1",
    marginBottom: 16,
    textTransform: "capitalize",
    fontWeight: "700",
  },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 24, color: "#F1F5F9" },
  postedBy: { fontSize: 14, color: "#64748B", marginBottom: 32, fontWeight: "600" },
  ownerActions: { flexDirection: "row", marginTop: 8, gap: 12 },
  nonOwnerActions: { marginTop: 8 },
  resolveBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  resolveBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  editBtn: {
    flex: 1,
    backgroundColor: "#1E293B",
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  editBtnText: { color: "#F8FAFC", fontWeight: "700", fontSize: 15 },
  deleteBtn: {
    flex: 1,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  deleteBtnText: { color: "#EF4444", fontWeight: "700", fontSize: 15 },
  claimBtn: {
    backgroundColor: "#6366F1",
    padding: 18,
    borderRadius: 999,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  claimBtnText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
