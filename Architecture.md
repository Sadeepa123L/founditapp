# FoundIt — Architecture Source of Truth (Minimal Spec)

**Module:** ITS 2127 - AMD | **Type:** Cross-platform Lost & Found | **Status:** Dev (July 2026)

## 1. Tech Stack

- **Frontend:** React Native (Expo SDK 54 - Expo Go compatibility).
- **Navigation:** Expo Router (File-based, `app/` folder).
- **Language:** TypeScript (Strict typing for models/props).
- **Backend/DB:** Firebase Firestore (NoSQL, real-time `onSnapshot`).
- **Auth:** Firebase Authentication (Email/Password + AsyncStorage persistence).
- **Storage:** Firebase Storage (Post photos under `posts/{postId}.jpg`).
- **State:** React Context (`AuthContext`) for Auth; Firestore `onSnapshot` for data; `useState` for forms/UI.
- **Native APIs:** `expo-location` (Location capture/geocoding), `expo-image-picker` (Camera/Gallery).
- **Styling:** React Native `StyleSheet.create` (No CSS frameworks).

---

## 2. Folder Structure

```text
founditapp/
├── app/                        # Expo Router Screens
│   ├── _layout.tsx             # Root layout (Auth wrapper + Redirects)
│   ├── welcome.tsx             # Public landing screen
│   ├── login.tsx / signup.tsx  # Public auth screens
│   ├── (tabs)/                 # Protected Bottom Tab Group
│   │   ├── _layout.tsx         # Bottom tab layout configuration
│   │   ├── index.tsx           # Home Feed (FlatList + FAB)
│   │   ├── create-post.tsx     # Add Post Screen
│   │   ├── my-posts.tsx        # My Posts Screen (Placeholder)
│   │   └── profile.tsx         # User profile and Log Out
│   └── post/[id].tsx           # Protected Detail View (Dynamic route)
├── src/
│   ├── context/AuthContext.tsx # Global auth state + useAuth()
│   ├── services/
│   │   ├── firebase.ts         # Firebase init (auth, db, storage exports)
│   │   └── postService.ts      # Firestore CRUD + Storage upload functions
│   ├── types/Post.ts           # Post types (Post, PostType, PostStatus, PostCategory)
│   └── components/             # Shared UI components (Reserved)
└── architecture.md             # This document
```
