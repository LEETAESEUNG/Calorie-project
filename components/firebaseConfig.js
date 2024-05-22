import firebase from 'firebase'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7JVMN3dh3gybU8iyr8eTHrvT8PquHqjE",
  authDomain: "calorie-project-b2875.firebaseapp.com",
  projectId: "calorie-project-b2875",
  storageBucket: "calorie-project-b2875.appspot.com",
  messagingSenderId: "362987181898",
  appId: "1:362987181898:web:e7fa6cdb4f138225ab53b3",
  measurementId: "G-91X5CX1ZL5"
};

// Initialize Firebase
const app =firebase. initializeApp(firebaseConfig);
const db = firebase.firestore(app)

export {db}