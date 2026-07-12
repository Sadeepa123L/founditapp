export interface ChatRoom {
  id: string;
  postId: string;
  postTitle: string;
  postImageUrl: string | null;
  participants: string[]; // [ownerId, requesterId]
  participantEmails: string[];
  lastMessage: string;
  updatedAt: number;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderEmail: string;
  text: string;
  createdAt: number;
}
