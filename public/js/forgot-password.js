import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Use exact config from your auth.js file
const firebaseConfig = {
  apiKey: "AIzaSyAJAjQJZcmTlU01v3H-M_K0QWJAaFr66Go",
  authDomain: "hospital-management-app-352ef.firebaseapp.com",
  projectId: "hospital-management-app-352ef",
  storageBucket: "hospital-management-app-352ef.firebasestorage.app",
  messagingSenderId: "39446725601",
  appId: "1:39446725601:web:29c83f3123472c526548a0",
  measurementId: "G-PP56TCPZVK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const messageDiv = document.getElementById('message');
    const btn = e.target.querySelector('button');
    
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    try {
        await sendPasswordResetEmail(auth, email);
        messageDiv.className = 'message success';
        messageDiv.textContent = '✓ Check your email for reset link';
        document.getElementById('email').value = '';
    } catch (error) {
        messageDiv.className = 'message error';
        if (error.code === 'auth/user-not-found') {
            messageDiv.textContent = 'No account found with this email';
        } else if (error.code === 'auth/invalid-email') {
            messageDiv.textContent = 'Invalid email address';
        } else {
            messageDiv.textContent = error.message;
        }
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Reset Link';
    }
});
