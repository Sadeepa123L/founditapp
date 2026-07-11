import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Claim, ClaimStatus } from "../types/Claim";
import { db } from "./firebase";
import { scheduleClaimNotification } from "./notificationService";
import { updatePost } from "./postService";

const claimsCollection = collection(db, "claims");

export async function createClaim(
  data: Omit<Claim, "id" | "status" | "createdAt">,
): Promise<string> {
  const docRef = await addDoc(claimsCollection, {
    ...data,
    status: "pending",
    createdAt: Date.now(),
  });
  
  await scheduleClaimNotification(data.postTitle, data.claimerEmail);

  return docRef.id;
}

export function subscribeToIncomingClaims(
  ownerId: string,
  onUpdate: (claims: Claim[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(
    claimsCollection,
    where("postOwnerId", "==", ownerId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const claims: Claim[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Claim, "id">),
      }));
      onUpdate(claims);
    },
    onError,
  );
}

export function subscribeToMyClaims(
  claimerId: string,
  onUpdate: (claims: Claim[]) => void,
  onError: (error: Error) => void,
) {
  const q = query(
    claimsCollection,
    where("claimerId", "==", claimerId),
    orderBy("createdAt", "desc"),
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const claims: Claim[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Claim, "id">),
      }));
      onUpdate(claims);
    },
    onError,
  );
}

export async function updateClaimStatus(claimId: string, postId: string, newStatus: ClaimStatus) {
  const claimRef = doc(db, "claims", claimId);
  await updateDoc(claimRef, { status: newStatus });

  if (newStatus === "accepted") {
    await updatePost(postId, { status: "claimed" });
  }
}
