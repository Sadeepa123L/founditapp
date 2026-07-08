import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore: getReactNativePersistence exists at runtime but isn't in the official type defs yet
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAD3ORzjBoCYlRdPe7qmrv_XDPiEsIxm8k",
  authDomain: "founditapp-e8f29.firebaseapp.com",
  projectId: "founditapp-e8f29",
  storageBucket: "founditapp-e8f29.firebasestorage.app",
  messagingSenderId: "411093873495",
  appId: "1:411093873495:web:52774417b9362d1ab60412",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
