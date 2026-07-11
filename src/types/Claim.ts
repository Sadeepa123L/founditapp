export type ClaimStatus = "pending" | "accepted" | "rejected";

export interface Claim {
  id: string;
  postId: string;
  postTitle: string;
  postOwnerId: string;
  claimerId: string;
  claimerEmail: string;
  message: string;
  status: ClaimStatus;
  createdAt: number;
}
