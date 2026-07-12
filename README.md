# FoundIt 🔍

FoundIt is a premium React Native mobile application built with Expo that helps university students and local communities report, track, and reclaim lost and found items. 

Featuring a sleek dark-mode aesthetic, interactive location mapping, and real-time chat, FoundIt makes returning lost items faster and safer than ever.

## ✨ Features

- **Real-Time Feed:** Scroll through a live feed of recently lost or found items.
- **Interactive Map Location Picker:** Drop a pin exactly where an item was found using `react-native-maps` and automatically convert the coordinates to a readable address via reverse geocoding.
- **Direct Messaging:** Instantly chat with item owners using secure, real-time Firestore chat rooms.
- **Instant Notifications:** Receive local push notifications the moment someone tries to claim your item.
- **Photo Uploads:** Seamlessly take photos with your camera or select from your gallery to attach to your posts.
- **Secure Authentication:** Full Firebase Authentication (Sign up, Log in, Change Password, Delete Account).

## 🛠 Tech Stack

- **Framework:** React Native / Expo (SDK 54)
- **Language:** TypeScript
- **Navigation:** Expo Router (File-based navigation)
- **Backend & Database:** Firebase (Auth, Firestore, Storage)
- **Maps & Location:** `expo-location`, `react-native-maps`
- **Media:** `expo-image-picker`

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [Git](https://git-scm.com/)
- The **Expo Go** app installed on your physical iOS or Android device (optional, but recommended for testing).

## ⚙️ Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/Sadeepa123L/founditapp.git
cd founditapp
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Firebase**
To run this app on your own backend, you must create a project in the [Firebase Console](https://console.firebase.google.com/):
1. Enable **Authentication** (Email/Password).
2. Enable **Firestore Database** (Create test rules or production rules).
3. Enable **Firebase Storage**.
4. Register a Web App in your Firebase project to get your configuration keys.
5. Open `src/services/firebase.ts` and replace the `firebaseConfig` object with your own credentials:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 📱 Running the App

Start the Expo development server:

```bash
npm start
```

This will start the Metro Bundler and display a QR code in your terminal.

- **To run on a physical device:** Open the Expo Go app on your phone and scan the QR code.
- **To run on an Android Emulator:** Press `a` in the terminal.
- **To run on an iOS Simulator (Mac only):** Press `i` in the terminal.

## 🔒 Security Note
*For production builds, ensure you update your Firestore and Storage security rules in the Firebase console to restrict database writes and storage uploads strictly to authenticated users!*
