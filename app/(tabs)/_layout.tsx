import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366F1", // Indigo
        tabBarInactiveTintColor: "#64748B", // Slate
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#1E293B",
          backgroundColor: "#0F172A",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-post"
        options={{
          title: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-posts"
        options={{
          title: "My Posts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
