import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Post } from "../types/Post";

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
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
      <Text style={styles.cardTitle}>{post.title}</Text>
      <Text style={styles.cardLocation}>📍 {post.location}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
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
  status: { fontSize: 12, color: "#999", textTransform: "capitalize" },
  cardTitle: { fontSize: 17, fontWeight: "600", marginBottom: 4 },
  cardLocation: { fontSize: 14, color: "#666" },
});
