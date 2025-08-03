import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

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
  const form = document.getElementById('registerForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const username = form.username.value.trim();
    const password = form.password.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save username to Firestore linked with uid
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
      });

      alert("Account created successfully!");
      // Optionally redirect to signin page
      window.location.href = "signin.html";

    } catch (error) {
      alert(error.message);
    }
  });
});
