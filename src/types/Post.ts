export type PostType = "lost" | "found";
export type PostStatus = "open" | "claimed" | "resolved";
export type PostCategory =
  | "electronics"
  | "documents"
  | "accessories"
  | "keys"
  | "other";

export interface Post {
  id: string;
  title: string;
  description: string;
  type: PostType;
  category: PostCategory;
  photoUrl?: string;
  location: string;
  status: PostStatus;
  postedBy: string;
  postedByEmail: string;
  createdAt: number;
}
