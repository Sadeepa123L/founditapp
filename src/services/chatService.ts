import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ChatMessage, ChatRoom } from "../types/Chat";
import { db } from "./firebase";
import { scheduleChatNotification } from "./notificationService";

const roomsCollection = collection(db, "chatRooms");
const messagesCollection = collection(db, "chatMessages");

/**
 * Creates a new chat room or returns the existing one for a specific post and user.
 */
export async function createOrGetRoom(
  postId: string,
  postTitle: string,
  postImageUrl: string | null,
  ownerId: string,
  ownerEmail: string,
  requesterId: string,
  requesterEmail: string
): Promise<string> {
  // Check if room already exists for this post and these two users
  const q = query(
    roomsCollection,
    where("postId", "==", postId),
    where("participants", "array-contains", requesterId)
  );
  
  const snapshot = await getDocs(q);
  
  // A bit of extra filtering to ensure the owner is also in the participants array
  const existingRoom = snapshot.docs.find((doc) => 
    doc.data().participants.includes(ownerId)
  );

  if (existingRoom) {
    return existingRoom.id;
  }

  // Create new room
  const docRef = await addDoc(roomsCollection, {
    postId,
    postTitle,
    postImageUrl,
    participants: [ownerId, requesterId],
    participantEmails: [ownerEmail, requesterEmail],
    lastMessage: "Chat started",
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });

  // Trigger local notification so the owner knows someone is reaching out
  await scheduleChatNotification(postTitle, requesterEmail);

  return docRef.id;
}

export async function sendMessage(
  roomId: string,
  senderId: string,
  senderEmail: string,
  text: string
): Promise<void> {
  const now = Date.now();
  
  await addDoc(messagesCollection, {
    roomId,
    senderId,
    senderEmail,
    text,
    createdAt: now,
  });

  // Update room lastMessage
  const roomRef = doc(db, "chatRooms", roomId);
  await updateDoc(roomRef, {
    lastMessage: text,
    updatedAt: now,
  });
}

export function subscribeToUserRooms(
  userId: string,
  onUpdate: (rooms: ChatRoom[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    roomsCollection,
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const rooms = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatRoom[];
      onUpdate(rooms);
    },
    onError
  );
}

export function subscribeToRoomMessages(
  roomId: string,
  onUpdate: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void
) {
  const q = query(
    messagesCollection,
    where("roomId", "==", roomId),
    orderBy("createdAt", "desc") // Descending so FlatList inverted works well
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      onUpdate(messages);
    },
    onError
  );
}
