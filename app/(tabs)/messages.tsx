import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useAuth } from "../../src/context/AuthContext";
import { subscribeToUserRooms } from "../../src/services/chatService";
import { ChatRoom } from "../../src/types/Chat";

export default function MessagesScreen() {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = subscribeToUserRooms(
      user.uid,
      (updatedRooms) => setRooms(updatedRooms),
      (error) => console.error("Error fetching rooms: ", error)
    );

    return () => unsubscribe();
  }, [user]);

  const renderItem = ({ item }: { item: ChatRoom }) => {
    // Find the other person's email to display
    const otherEmail = item.participantEmails.find(e => e !== user?.email) || "Unknown User";

    // Format the time roughly
    const date = new Date(item.updatedAt);
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <TouchableOpacity 
        style={styles.roomCard}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{otherEmail[0].toUpperCase()}</Text>
        </View>
        <View style={styles.roomInfo}>
          <Text style={styles.roomTitle} numberOfLines={1}>{otherEmail}</Text>
          <Text style={styles.postTitle} numberOfLines={1}>Re: {item.postTitle}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
        <Text style={styles.time}>{timeString}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      {rooms.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="chatbubbles-outline" size={64} color="#64748B" />
          <Text style={styles.emptyText}>No messages yet</Text>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#0F172A",
  },
  headerTitle: { fontSize: 34, fontWeight: "900", color: "#F8FAFC", letterSpacing: -1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#94A3B8", fontSize: 16, marginTop: 16, fontWeight: "500" },
  listContent: { padding: 16 },
  roomCard: {
    flexDirection: "row",
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { color: "#FFFFFF", fontSize: 20, fontWeight: "bold" },
  roomInfo: { flex: 1, justifyContent: "center" },
  roomTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC", marginBottom: 2 },
  postTitle: { fontSize: 13, color: "#6366F1", fontWeight: "600", marginBottom: 4 },
  lastMessage: { fontSize: 14, color: "#94A3B8" },
  time: { fontSize: 12, color: "#64748B", marginLeft: 8 },
});
