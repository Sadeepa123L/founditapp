import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Post } from "../types/Post";
import { db, storage } from "./firebase";

const postsCollection = collection(db, "posts");

export async function uploadPostPhoto(
  uri: string,
  postId: string,
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const photoRef = ref(storage, `posts/${postId}.jpg`);
  await uploadBytes(photoRef, blob);
  return await getDownloadURL(photoRef);
}

export function subscribeToPosts(
  onUpdate: (posts: Post[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(postsCollection, orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const posts: Post[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Post, "id">),
      }));
      onUpdate(posts);
    },
    onError,
  );
}

export function subscribeToMyPosts(
  uid: string,
  onUpdate: (posts: Post[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(
    postsCollection,
    where("postedBy", "==", uid),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const posts: Post[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Post, "id">),
      }));
      onUpdate(posts);
    },
    onError,
  );
}

export async function createPost(
  data: Omit<Post, "id" | "createdAt" | "status">,
): Promise<string> {
  const docRef = await addDoc(postsCollection, {
    ...data,
    status: "open",
    createdAt: Date.now(),
  });
  return docRef.id;
}

export async function updatePost(postId: string, data: Partial<Post>) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, data);
}

export async function deletePost(postId: string) {
  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
}
