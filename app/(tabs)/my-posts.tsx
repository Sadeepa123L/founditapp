import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { subscribeToMyPosts } from "../../src/services/postService";
import { Post } from "../../src/types/Post";
import PostCard from "../../src/components/PostCard";

export default function MyPostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToMyPosts(
      user.uid,
      (data) => {
        setPosts(data);
        setLoading(false);
        setRefreshing(false);
      },
      (error) => {
        console.error("Failed to load my posts:", error);
        setLoading(false);
        setRefreshing(false);
      },
    );

    return unsubscribe;
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Posts</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(true)}
          />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>You haven't posted anything yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => router.push(`/post/${item.id}`)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", minHeight: 200 },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#0F172A",
  },
  headerTitle: { fontSize: 34, fontWeight: "900", color: "#F8FAFC", letterSpacing: -1 },
  emptyText: { color: "#94A3B8", fontSize: 16, marginTop: 40, textAlign: "center", fontWeight: "500" },
});
