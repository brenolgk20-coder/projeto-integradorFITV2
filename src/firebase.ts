
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyAOpmKvlq-CbZpp4B1HzkC2F5kBBDrMxIg",
  authDomain: "fitlife-app-9ee18.firebaseapp.com",
  projectId: "fitlife-app-9ee18",
  storageBucket: "fitlife-app-9ee18.firebasestorage.app",
  messagingSenderId: "617242503178",
  appId: "1:617242503178:web:363b41647ed0d859e517f3",
  measurementId: "G-4B2NJMW7SK"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = require("firebase/auth").getAuth(app);
