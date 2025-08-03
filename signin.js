import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const input = form.email.value.trim();  // can be email or username
    const password = form.password.value;

    try {
      let emailToUse = input;

      if (!input.includes('@')) {
        // It's a username, find the email from Firestore
        const q = query(collection(db, "users"), where("username", "==", input));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error("No user found with that username");
        }

        // Use the email from the first matching user
        emailToUse = querySnapshot.docs[0].data().email;
      }

      // Sign in using the email and password
      await signInWithEmailAndPassword(auth, emailToUse, password);

      alert("Signed in successfully!");
      window.location.href = "index.html";  // redirect to home page

    } catch (error) {
      alert(error.message);
    }
  });
});
