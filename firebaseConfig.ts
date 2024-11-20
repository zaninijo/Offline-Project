import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// tem um erro de typescript nesse import. eu não consegui arrumar então vai ficar assim mesmo
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyApLXh8LkCbuqN-V--bz2NWiJUfAn2yLL8",
  authDomain: "offlineprojectapp.firebaseapp.com",
  projectId: "offlineprojectapp",
  storageBucket: "offlineprojectapp.appspot.com",
  messagingSenderId: "254314547322",
  appId: "1:254314547322:web:02247c20ebdd5043dfd3c3",
  measurementId: "G-9Q5R4WK8TC"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(ReactNativeAsyncStorage)});