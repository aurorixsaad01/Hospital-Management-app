import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJAjQJZcmTlU01v3H-M_K0QWJAaFr66Go",
  authDomain: "hospital-management-app-352ef.firebaseapp.com",
  projectId: "hospital-management-app-352ef",
  storageBucket: "hospital-management-app-352ef.firebasestorage.app",
  messagingSenderId: "39446725601",
  appId: "1:39446725601:web:29c83f3123472c526548a0",
  measurementId: "G-PP56TCPZVK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login functionality
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Login successful!");
      alert("Welcome back! Redirecting to dashboard...");
      window.location.href = "patient-dashboard.html";
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
      console.error("Error:", error);
    });
});
