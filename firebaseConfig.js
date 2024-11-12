import firebase from 'firebase/compat/app';
import {getDatabase} from 'firebase/database';
const firebaseConfig = {
  apiKey: "AIzaSyCB74MZm1S9zJGPuooWO8c1_s2MZogx_M4",
  authDomain: "yoga-app-9c322.firebaseapp.com",
  databaseURL: "https://yoga-app-9c322-default-rtdb.firebaseio.com",
  projectId: "yoga-app-9c322",
  storageBucket: "yoga-app-9c322.firebasestorage.app",
  messagingSenderId: "140181823484",
  appId: "1:140181823484:web:edf74c67f61cbf057c5c79",
  measurementId: "G-SRXCKG813G"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

const db = getDatabase();

export {db};