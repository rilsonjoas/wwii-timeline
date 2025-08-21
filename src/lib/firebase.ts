import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCm8hvVWRNaS_Xlewncy2XTD1JAgci4ay0",
  authDomain: "wwii-timeline.firebaseapp.com",
  projectId: "wwii-timeline",
  storageBucket: "wwii-timeline.firebasestorage.app",
  messagingSenderId: "416521857109",
  appId: "1:416521857109:web:32f5cc91a46575b1340cdc",
  measurementId: "G-HQ4FSZN562"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);