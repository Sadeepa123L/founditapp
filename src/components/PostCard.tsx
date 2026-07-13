import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Post } from "../types/Post";

interface PostCardProps {
  post: Post;
  onPress: () => void;
}

export default function PostCard({ post, onPress }: PostCardProps) {
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Just now";

  const isLost = post.type === "lost";
  const posterInitial = post.postedByEmail
    ? post.postedByEmail.charAt(0).toUpperCase()
    : "?";

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {post.photoUrl ? (
          <Image source={{ uri: post.photoUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={48} color="#D1D5DB" />
          </View>
        )}
        <View
          style={[
            styles.floatingBadge,
            isLost ? styles.badgeLost : styles.badgeFound,
          ]}
        >
          <Text style={styles.floatingBadgeText}>
            {post.type.toUpperCase()}
          </Text>
        </View>
        <View style={styles.avatarFloat}>
          <Text style={styles.avatarTextFloat}>{posterInitial}</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {post.title}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="location" size={16} color="#8B5CF6" />
          <Text style={styles.infoText} numberOfLines={1}>
            {post.location}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time" size={16} color="#8B5CF6" />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText} numberOfLines={1}>
            By {post.postedByEmail}
          </Text>
          <View style={styles.statusWrap}>
            <Text style={styles.statusText}>{post.status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  imageContainer: {
    width: "100%",
    height: 220,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  badgeLost: {
    backgroundColor: "rgba(255, 77, 77, 0.9)",
  },
  badgeFound: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
  },
  floatingBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  avatarFloat: {
    position: "absolute",
    bottom: -20,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#1E293B",
    zIndex: 10,
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  avatarTextFloat: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 15,
    color: "#94A3B8",
    marginLeft: 8,
    flex: 1,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 14,
    color: "#64748B",
    flex: 1,
    fontWeight: "600",
  },
  statusWrap: {
    backgroundColor: "#0F172A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "800",
  },
});
