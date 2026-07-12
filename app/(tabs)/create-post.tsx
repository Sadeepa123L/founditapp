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
import { useAuth } from "../../src/context/AuthContext";
import {
  createPost,
  updatePost,
  uploadPostPhoto,
} from "../../src/services/postService";
import { PostCategory, PostType } from "../../src/types/Post";

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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setPhotoUri(null);
    setType("lost");
    setCategory("other");
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

      resetForm();
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

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => {
          resetForm();
          router.back();
        }}
      >
        <Text style={styles.cancelBtnText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  title: { fontSize: 32, fontWeight: "900", marginBottom: 24, marginTop: 40, color: "#F8FAFC", letterSpacing: -1 },
  toggleRow: { flexDirection: "row", marginBottom: 24, gap: 12 },
  toggleBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "#1E293B",
    alignItems: "center",
  },
  toggleActiveLost: { backgroundColor: "rgba(255, 77, 77, 0.2)" },
  toggleActiveFound: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
  toggleText: { color: "#94A3B8", fontWeight: "700" },
  toggleTextActive: { color: "#F8FAFC", fontWeight: "900" },
  input: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: "#F8FAFC",
  },
  textArea: { height: 120, textAlignVertical: "top" },
  label: { fontSize: 15, fontWeight: "800", marginBottom: 12, color: "#F1F5F9", letterSpacing: -0.5 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#1E293B",
  },
  chipActive: { backgroundColor: "#6366F1" },
  chipText: { color: "#94A3B8", fontSize: 14, textTransform: "capitalize", fontWeight: "600" },
  chipTextActive: { color: "#FFFFFF", fontSize: 14, textTransform: "capitalize", fontWeight: "700" },
  locationRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  locationBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1E293B",
    justifyContent: "center",
    alignItems: "center",
  },
  locationBtnText: { fontSize: 24 },
  photoRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  photoBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#1E293B",
    alignItems: "center",
  },
  photoBtnText: { fontSize: 15, color: "#F1F5F9", fontWeight: "700" },
  preview: { width: "100%", height: 200, borderRadius: 20, marginBottom: 16 },
  submitBtn: {
    backgroundColor: "#6366F1",
    padding: 18,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#6366F1",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  submitBtnText: { color: "#FFFFFF", fontWeight: "800", fontSize: 18 },
  cancelBtn: { padding: 16, alignItems: "center", marginBottom: 60 },
  cancelBtnText: { color: "#94A3B8", fontWeight: "600", fontSize: 16 },
});
