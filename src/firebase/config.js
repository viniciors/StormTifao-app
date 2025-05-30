// src/firebase/config.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCepX4jVNoGig-0zTcUj5xa4jzqRwB7OAw",
  authDomain: "stormtifao.firebaseapp.com",
  projectId: "stormtifao",
  messagingSenderId: "857437991374",
  appId: "1:857437991374:web:4b76ff7c65e672c4a7bb9f"
};

// Evita reinicializar
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Exporte o auth compat
export const auth = firebase.auth();
