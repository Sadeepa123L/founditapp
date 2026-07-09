import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../src/context/AuthContext";
import {
  createPost,
  updatePost,
  uploadPostPhoto,
} from "../src/services/postService";
import { PostCategory, PostType } from "../src/types/Post";

const CATEGORIES: PostCategory[] = [
  "electronics",
  "documents",
  "accessories",
  "keys",
  "other",
];

export default function CreatePostScreen() {
  const { user } = useAuth();
  const [type, setType] = useState<PostType>("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PostCategory>("other");
  const [location, setLocation] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "We need access to your photos.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "We need access to your camera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const captureLocation = async () => {
    setFetchingLocation(true);
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission needed", "We need access to your location.");
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      const [address] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      const readable = address
        ? `${address.street || ""} ${address.city || ""}`.trim()
        : `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
      setLocation(readable);
    } catch (error) {
      Alert.alert("Error", "Could not fetch location.");
    } finally {
      setFetchingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !location) {
      Alert.alert(
        "Missing info",
        "Please fill in title, description, and location.",
      );
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      const postId = await createPost({
        title,
        description,
        type,
        category,
        location,
        postedBy: user.uid,
        postedByEmail: user.email || "",
      });

      if (photoUri) {
        const photoUrl = await uploadPostPhoto(photoUri, postId);
        await updatePost(postId, { photoUrl });
      }

      router.back();
    } catch (error: any) {
      Alert.alert("Failed to create post", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16 }}
    >
      <Text style={styles.title}>New Post</Text>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, type === "lost" && styles.toggleActiveLost]}
          onPress={() => setType("lost")}
        >
          <Text
            style={
              type === "lost" ? styles.toggleTextActive : styles.toggleText
            }
          >
            Lost
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            type === "found" && styles.toggleActiveFound,
          ]}
          onPress={() => setType("found")}
        >
          <Text
            style={
              type === "found" ? styles.toggleTextActive : styles.toggleText
            }
          >
            Found
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Title (e.g. Black wallet near library)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description"
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipRow}>
        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}
          >
            <Text
              style={category === c ? styles.chipTextActive : styles.chipText}
            >
              {c}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Location</Text>
      <View style={styles.locationRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="e.g. Main Library, 2nd floor"
          value={location}
          onChangeText={setLocation}
        />
        <TouchableOpacity style={styles.locationBtn} onPress={captureLocation}>
          {fetchingLocation ? (
            <ActivityIndicator color="#2563eb" />
          ) : (
            <Text style={styles.locationBtnText}>📍</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Photo</Text>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : null}
      <View style={styles.photoRow}>
        <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
          <Text style={styles.photoBtnText}>📷 Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
          <Text style={styles.photoBtnText}>🖼 Gallery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitBtnText}>
          {submitting ? "Posting..." : "Post"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, marginTop: 40 },
  toggleRow: { flexDirection: "row", marginBottom: 16, gap: 8 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  toggleActiveLost: { backgroundColor: "#fee2e2", borderColor: "#dc2626" },
  toggleActiveFound: { backgroundColor: "#dcfce7", borderColor: "#16a34a" },
  toggleText: { color: "#666", fontWeight: "600" },
  toggleTextActive: { color: "#111", fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8, color: "#444" },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  chipActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  chipText: { color: "#666", fontSize: 13, textTransform: "capitalize" },
  chipTextActive: { color: "#fff", fontSize: 13, textTransform: "capitalize" },
  locationRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  locationBtn: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  locationBtnText: { fontSize: 20 },
  photoRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  photoBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  photoBtnText: { fontSize: 14 },
  preview: { width: "100%", height: 180, borderRadius: 8, marginBottom: 12 },
  submitBtn: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  submitBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  cancelBtn: { padding: 14, alignItems: "center", marginBottom: 40 },
  cancelBtnText: { color: "#666" },
});
