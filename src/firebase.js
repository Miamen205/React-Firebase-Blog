import firebase from "firebase/app";
require("firebase/database");
require("firebase/auth")
require( "firebase/firestore")

const app = firebase.initializeApp({
  apiKey: "AIzaSyAL0fKhTPC0fzaqr5Hg9oYVI29fq9LFO_M",
  authDomain: "react-my-mini-blog-8c346.firebaseapp.com",
  databaseURL: "https://react-my-mini-blog-8c346-default-rtdb.firebaseio.com",
  projectId: "react-my-mini-blog-8c346",
  storageBucket: "react-my-mini-blog-8c346.appspot.com",
  messagingSenderId: "496225625577",
  appId: "1:496225625577:web:7a222f015f5ba7129c5778",
  measurementId: "G-VFQ4LWTWD3"
})
let firebaseCache;

export const getFirebase = () => {
  if (firebaseCache) {
    return firebaseCache;
  }

  // firebase.initializeApp(config);
  firebaseCache = firebase;
  return firebase;
};
export const firestore = firebase.firestore()
export const auth = app.auth()
export default app
