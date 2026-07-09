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

        {isOwner && (
          <View style={styles.ownerActions}>
            {post.status !== "resolved" && (
              <TouchableOpacity
                style={styles.resolveBtn}
                onPress={handleMarkResolved}
              >
                <Text style={styles.resolveBtnText}>Mark as Resolved</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteBtnText}>Delete Post</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  ownerActions: { gap: 10 },
  resolveBtn: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  resolveBtnText: { color: "#fff", fontWeight: "700" },
  deleteBtn: {
    backgroundColor: "#fee2e2",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteBtnText: { color: "#dc2626", fontWeight: "700" },
});
