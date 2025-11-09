// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Your Firebase Configuration
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
const db = getFirestore(app);

// Global variable for current user
let currentUser = null;


// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("User logged in:", user.email);
    loadPatientData(user.uid);
    loadDoctors();
    loadAppointments(user.uid);
  } else {
    // User is not logged in, redirect to login page
    console.log("No user logged in, redirecting...");
    window.location.href = "login.html";
  }
});

// Load Patient Data
async function loadPatientData(userId) {
  try {
    const patientDoc = await getDoc(doc(db, "patients", userId));
    
    if (patientDoc.exists()) {
      const patientData = patientDoc.data();
      
      // Update UI with patient data
      document.getElementById("patientName").textContent = patientData.name || "Patient";
      document.getElementById("memberId").textContent = patientData.memberId || "CARE-" + userId.substring(0, 8).toUpperCase();
      
      // Generate QR Code for Member ID
      generateQRCode(patientData.memberId || "CARE-" + userId.substring(0, 8).toUpperCase());
    } else {
      // If no patient document exists, create a default one
      document.getElementById("patientName").textContent = currentUser.email.split('@')[0];
      const defaultMemberId = "CARE-" + userId.substring(0, 8).toUpperCase();
      document.getElementById("memberId").textContent = defaultMemberId;
      generateQRCode(defaultMemberId);
    }
  } catch (error) {
    console.error("Error loading patient data:", error);
    document.getElementById("patientName").textContent = "Patient";
    document.getElementById("memberId").textContent = "Loading...";
  }
}

// Generate QR Code
function generateQRCode(memberId) {
  const qrContainer = document.getElementById("qrCode");
  // Clear any existing QR code
  qrContainer.innerHTML = '';
  
  try {
    new QRCode(qrContainer, {
      text: memberId,
      width: 120,
      height: 120,
      colorDark: "#667eea",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log("QR Code generated successfully");
  } catch (error) {
    console.error("QR Code generation error:", error);
    qrContainer.innerHTML = '<p style="color: white; font-size: 12px;">QR unavailable</p>';
  }
}


// Load Doctors
async function loadDoctors() {
  try {
    const doctorsSnapshot = await getDocs(collection(db, "doctors"));
    const doctorsGrid = document.getElementById("doctorsGrid");
    
    if (doctorsSnapshot.empty) {
      // Display sample doctors if database is empty
      doctorsGrid.innerHTML = generateSampleDoctors();
    } else {
      doctorsGrid.innerHTML = "";
      doctorsSnapshot.forEach((doc) => {
        const doctor = doc.data();
        doctorsGrid.innerHTML += createDoctorCard(doctor, doc.id);
      });
    }
    
    // Add event listeners to book appointment buttons
    document.querySelectorAll(".btn-book-appointment").forEach(btn => {
      btn.addEventListener("click", handleBookAppointment);
    });
  } catch (error) {
    console.error("Error loading doctors:", error);
    document.getElementById("doctorsGrid").innerHTML = generateSampleDoctors();
  }
}

// Generate Sample Doctors (for demo purposes)
function generateSampleDoctors() {
  const sampleDoctors = [
    {
      name: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      experience: "15 years",
      rating: "4.8",
      availability: "Mon-Fri, 9AM-5PM"
    },
    {
      name: "Dr. Michael Chen",
      specialization: "Neurologist",
      experience: "12 years",
      rating: "4.9",
      availability: "Tue-Sat, 10AM-6PM"
    },
    {
      name: "Dr. Emily Williams",
      specialization: "Pediatrician",
      experience: "10 years",
      rating: "4.7",
      availability: "Mon-Fri, 8AM-4PM"
    }
  ];
  
  let html = "";
  sampleDoctors.forEach((doctor, index) => {
    html += createDoctorCard(doctor, `sample-${index}`);
  });
  return html;
}

// Create Doctor Card HTML
function createDoctorCard(doctor, doctorId) {
  const initials = doctor.name.split(' ').map(n => n[0]).join('');
  return `
    <div class="doctor-card">
      <div class="doctor-header">
        <div class="doctor-avatar">${initials}</div>
        <div class="doctor-info">
          <h3>${doctor.name}</h3>
          <p class="doctor-specialization">${doctor.specialization}</p>
          <div class="doctor-rating">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="gold" stroke="gold">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            ${doctor.rating || "4.8"} • ${doctor.experience || "10 years"}
          </div>
        </div>
      </div>
      <div class="doctor-details">
        <div class="doctor-detail-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${doctor.availability || "Mon-Fri, 9AM-5PM"}</span>
        </div>
      </div>
      <button class="btn-book-appointment" data-doctor-id="${doctorId}" data-doctor-name="${doctor.name}">
        Book Appointment
      </button>
    </div>
  `;
}

// Handle Book Appointment
function handleBookAppointment(e) {
  const doctorId = e.target.dataset.doctorId;
  const doctorName = e.target.dataset.doctorName;
  
  if (!currentUser) {
    alert("Please log in to book an appointment");
    return;
  }
  
  // For now, show alert (later you'll create an appointment booking modal/page)
  alert(`Booking appointment with ${doctorName}. Feature coming soon!`);
  console.log("Booking appointment with doctor:", doctorId);
  
  // TODO: Implement appointment booking modal or redirect to booking page
}

// Load Appointments
async function loadAppointments(userId) {
  try {
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("patientId", "==", userId),
      orderBy("date", "desc"),
      limit(5)
    );
    
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const tableBody = document.querySelector("#appointmentsTable tbody");
    
    if (appointmentsSnapshot.empty) {
      // Display sample appointments if database is empty
      tableBody.innerHTML = generateSampleAppointments();
    } else {
      tableBody.innerHTML = "";
      appointmentsSnapshot.forEach((doc) => {
        const appointment = doc.data();
        tableBody.innerHTML += createAppointmentRow(appointment, doc.id);
      });
    }
    
    // Add event listeners to action buttons
    document.querySelectorAll(".btn-action").forEach(btn => {
      btn.addEventListener("click", handleAppointmentAction);
    });
  } catch (error) {
    console.error("Error loading appointments:", error);
    document.querySelector("#appointmentsTable tbody").innerHTML = generateSampleAppointments();
  }
}

// Generate Sample Appointments (for demo purposes)
function generateSampleAppointments() {
  const sampleAppointments = [
    {
      date: "2025-11-15",
      doctorName: "Dr. Sarah Johnson",
      specialization: "Cardiologist",
      status: "upcoming"
    },
    {
      date: "2025-11-01",
      doctorName: "Dr. Michael Chen",
      specialization: "Neurologist",
      status: "completed"
    },
    {
      date: "2025-10-20",
      doctorName: "Dr. Emily Williams",
      specialization: "Pediatrician",
      status: "completed"
    }
  ];
  
  let html = "";
  sampleAppointments.forEach((appointment, index) => {
    html += createAppointmentRow(appointment, `sample-${index}`);
  });
  return html;
}

// Create Appointment Row HTML
function createAppointmentRow(appointment, appointmentId) {
  const statusClass = `status-${appointment.status}`;
  const statusText = appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1);
  
  return `
    <tr>
      <td>${formatDate(appointment.date)}</td>
      <td>${appointment.doctorName}</td>
      <td>${appointment.specialization}</td>
      <td><span class="status-badge ${statusClass}">${statusText}</span></td>
      <td>
        <button class="btn-action" data-appointment-id="${appointmentId}">
          ${appointment.status === 'upcoming' ? 'View' : 'Details'}
        </button>
      </td>
    </tr>
  `;
}

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Handle Appointment Action
function handleAppointmentAction(e) {
  const appointmentId = e.target.dataset.appointmentId;
  alert(`Viewing appointment details. Feature coming soon!`);
  console.log("Viewing appointment:", appointmentId);
  
  // TODO: Implement appointment details modal or redirect to details page
}

// Quick Action Buttons
document.getElementById("virtualConsultBtn").addEventListener("click", () => {
  alert("Virtual Consultation feature coming soon! This will connect you with available doctors online.");
  console.log("Virtual consultation requested");
  // TODO: Implement virtual consultation feature
});

document.getElementById("viewPrescriptionsBtn").addEventListener("click", () => {
  alert("Prescription viewer coming soon! You'll be able to view all your medical records here.");
  console.log("View prescriptions clicked");
  // TODO: Redirect to prescriptions page
});

document.getElementById("emergencyBtn").addEventListener("click", () => {
  const confirmed = confirm("Emergency Services\n\nAre you in a medical emergency?\n\nClick OK to call emergency services or view emergency contacts.");
  if (confirmed) {
    alert("Emergency contacts:\n\nAmbulance: 108\nHospital Emergency: +91-XXX-XXX-XXXX\n\nYour location and medical ID have been shared.");
  }
  console.log("Emergency button clicked");
});

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Error logging out. Please try again.");
  }
});

// Log page load
console.log("Patient Dashboard loaded successfully");
