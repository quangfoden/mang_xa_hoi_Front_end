// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import {
//   getDatabase,
//   ref,
//   push,
//   onValue,
//   query,
//   orderByChild,
//   equalTo,
//   limitToLast,
//   set,
// } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyDB7HtXutLK3zjlFotZ24ZRo3YRvpWXFUg",
//   authDomain: "mangxahoi-5e540.firebaseapp.com",
//   projectId: "mangxahoi-5e540",
//   storageBucket: "mangxahoi-5e540.appspot.com",
//   messagingSenderId: "960619117301",
//   appId: "1:960619117301:web:d23f86713dc8a5aca623bc",
//   measurementId: "G-ZK9RFH95S8"
// };
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);


// const database = getDatabase();
// export {
//   database,
//   ref,
//   push,
//   onValue,
//   query,
//   orderByChild,
//   equalTo,
//   limitToLast,
//   set,
// };
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  addDoc,
  updateDoc
} from "firebase/firestore";

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

// Initialize Firestore
const firestore = getFirestore(app);
const database = getDatabase();

export {
  database,
  firestore,
  updateDoc,
  ref,
  push,
  onValue,
  query,
  orderByChild,
  equalTo,
  limitToLast,
  set,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
};
