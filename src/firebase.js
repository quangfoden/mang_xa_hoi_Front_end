import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  set,
} from "firebase/database";

const firebaseConfig = {
  // apiKey: "AIzaSyDmJzpEsdSJT8JpL1Gx1TIv6A3RD0Bsfgg",
  // authDomain: "first-chat-app-b1523.firebaseapp.com",
  // projectId: "first-chat-app-b1523",
  // storageBucket: "first-chat-app-b1523.appspot.com",
  // messagingSenderId: "182155265077",
  // appId: "1:182155265077:web:761d03c65d5d34a9c69d7c",
  // measurementId: "G-VVFGYJ586W",
  apiKey: "AIzaSyDB7HtXutLK3zjlFotZ24ZRo3YRvpWXFUg",
  authDomain: "mangxahoi-5e540.firebaseapp.com",
  projectId: "mangxahoi-5e540",
  storageBucket: "mangxahoi-5e540.appspot.com",
  messagingSenderId: "960619117301",
  appId: "1:960619117301:web:d23f86713dc8a5aca623bc",
  measurementId: "G-ZK9RFH95S8"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const database = getDatabase();
export {
  database,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  set,
};
