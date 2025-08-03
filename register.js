import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHSvsU8959UOsPrJKLfPLDDKzzXer-eco",
  authDomain: "orbital-raid-data.firebaseapp.com",
  projectId: "orbital-raid-data",
  storageBucket: "orbital-raid-data.firebasestorage.app",
  messagingSenderId: "1026103707268",
  appId: "1:1026103707268:web:82aadea2cd5765599824d1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('registerForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  // username can be captured here if you want but Firebase auth only needs email+password

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Success! User created
      alert("Account created successfully");
      // Optionally redirect or clear form
    })
    .catch((error) => {
      alert(error.message);
    });
});
