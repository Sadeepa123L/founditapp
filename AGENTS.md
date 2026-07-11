# FOUNDIT — AI OPERATIONAL MANUAL

## GLOBAL RULES

- Tech Stack: TypeScript, Expo Router (app/), Firebase (src/services/firebase.ts).
- Core Rules: No Firebase inside screens (use src/services/). Use AuthContext for auth. Use onSnapshot for live data.
- UI Rules: Use StyleSheet.create. Colors: Blue #2563eb, Red #dc2626, Green #16a34a. No CSS frameworks.
- Safety: Always check (user.uid === postedBy) before showing Edit/Delete buttons.
- Workflow: Read architecture.md -> Run Task -> Update architecture.md -> Mark Phase ✅.

---

## PHASE 0 — SETUP

Status: ✅ COMPLETED

- [x] Create Expo TS project with Expo Router (SDK 54).
- [x] Setup Firebase Auth, Firestore, and Storage (Blaze plan).
- [x] Initialize Firebase in src/services/firebase.ts (with @ts-ignore for RN persistence).

## PHASE 1 — AUTHENTICATION

Status: ✅ COMPLETED

- [x] Build AuthContext (user, loading, login, signup, logout).
- [x] Create app/login.tsx and app/signup.tsx with inputs validation.
- [x] Create app/welcome.tsx with Gradient UI and links.
- [x] Implement auth redirection logic in app/\_layout.tsx.

## PHASE 2 — HOME FEED

Status: ✅ COMPLETED

- [x] Create src/types/Post.ts with Post, PostType, PostStatus, PostCategory types.
- [x] Add subscribeToPosts() in postService.ts (real-time onSnapshot, DESC order).
- [x] Create app/index.tsx with FlatList feed and floating "+" button.

## PHASE 3 — CRUD & NATIVE API

Status: ✅ COMPLETED

- [x] Add createPost, updatePost, deletePost, uploadPostPhoto in postService.ts.
- [x] Create app/create-post.tsx with expo-location and expo-image-picker.
- [x] Create app/post/[id].tsx with real-time detail view and owner-only Resolve/Delete.

## PHASE 4 — UI POLISH

Status: ✅ COMPLETED

- [x] Redesign app/welcome.tsx with custom gradients, icons, and pill buttons.
- [x] Add back-navigation arrow to login and signup screens.

---

## PHASE 5 — POST EDITING

Status: ⬜ NOT STARTED

- [ ] Add "Edit" button on app/post/[id].tsx (visible to owner only).
- [ ] Support full content edits by reusing app/create-post.tsx in edit-mode (or build app/post/edit/[id].tsx).
- [ ] Keep existing photoUrl if user doesn't change it; re-upload only if a new photo is selected.
- [ ] Deliverable: Owner can fully edit post fields, and changes reflect instantly across the app.

## PHASE 6 — MY POSTS SCREEN

Status: ✅ COMPLETED

- [x] Create app/my-posts.tsx screen.
- [x] Add subscribeToMyPosts(uid) in postService.ts for Firestore-side filtering.
- [x] Extract the post card layout into a shared component in src/components/PostCard.tsx.
- [x] Deliverable: A dedicated, live-updating screen that shows only the current user's posts.

## PHASE 7 — BOTTOM TAB NAVIGATION

Status: ✅ COMPLETED

- [x] Create app/(tabs)/_layout.tsx to setup bottom tab navigation (Home, Add, My Posts, Profile).
- [x] Move index.tsx, create-post.tsx, and my-posts.tsx into the new app/(tabs)/ folder.
- [x] Update root app/_layout.tsx auth redirect logic to handle the new (tabs) route segments correctly.
- [x] Deliverable: Tab navigation works for main screens; auth and detail screens remain full-screen.

## PHASE 8 — CLAIMS FLOW

Status: ✅ COMPLETED

- [x] Create src/types/Claim.ts schema and add claimService.ts (create, subscribe for post/user, updateStatus).
- [x] Add a "Claim this" modal form button on app/post/[id].tsx for non-owners.
- [x] Make the app auto-change parent post status to "claimed" when the owner accepts a claim.
- [x] Create app/claims-inbox.tsx screen with Accept/Reject action buttons for incoming claims.
- [x] Deliverable: Full relational claim system where non-owners request items and owners manage requests.

## PHASE 9 — NOTIFICATIONS

Status: ✅ COMPLETED

- [x] Install and setup expo-notifications library.
- [x] Trigger a local device notification whenever a new claim is created on an owner's post.
- [x] Deliverable: Local notification pops up in real-time on claim activity.

## PHASE 10 — SECURITY RULES HARDENING

Status: ⬜ NOT STARTED

- [ ] Write Firestore rules: Global reads allowed, but writes restricted to authenticated document owners.
- [ ] Write Storage rules: Limit photo upload writes strictly to the authenticated user's own paths.
- [ ] Deploy rules to Firebase dashboard, retire test-mode, and run a full app test to verify access control.
- [ ] Deliverable: Production-ready backend security rules fully operational.
