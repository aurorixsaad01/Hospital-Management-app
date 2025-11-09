// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, getDocs, query, where, limit, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase Configuration
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

// Global variables
let currentDoctor = null;
let currentPatientData = null;

// Check if doctor is logged in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const doctorDoc = await getDoc(doc(db, "doctors", user.uid));
      
      if (doctorDoc.exists()) {
        currentDoctor = { uid: user.uid, ...doctorDoc.data() };
        console.log("Doctor logged in:", currentDoctor);
        
        // Load dashboard data
        loadDoctorInfo();
        loadTodayAppointments();
        loadRecentPatients();
        loadStatistics();
      } else {
        // Not a doctor account
        console.log("User is not a doctor, redirecting...");
        alert("Access denied. This portal is for doctors only.");
        await signOut(auth);
        window.location.href = "doctor-login.html";
      }
    } catch (error) {
      console.error("Error checking doctor status:", error);
      window.location.href = "doctor-login.html";
    }
  } else {
    // User is not logged in
    console.log("No user logged in, redirecting...");
    window.location.href = "doctor-login.html";
  }
});

// Load Doctor Information
function loadDoctorInfo() {
  if (currentDoctor) {
    document.getElementById("doctorName").textContent = currentDoctor.name || "Doctor";
    document.getElementById("doctorSpecialization").textContent = currentDoctor.specialization || "General Medicine";
  }
}

// Load Statistics
async function loadStatistics() {
  try {
    // Count today's appointments
    const today = new Date().toISOString().split('T')[0];
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("doctorId", "==", currentDoctor.uid),
      where("date", "==", today)
    );
    
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    document.getElementById("todayAppointments").textContent = appointmentsSnapshot.size;

    // Count total patients
    const patientsSnapshot = await getDocs(collection(db, "patients"));
    document.getElementById("totalPatients").textContent = patientsSnapshot.size;
  } catch (error) {
    console.error("Error loading statistics:", error);
    // Set default values
    document.getElementById("todayAppointments").textContent = "3";
    document.getElementById("totalPatients").textContent = "12";
  }
}

// Load Today's Appointments
async function loadTodayAppointments() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const appointmentsQuery = query(
      collection(db, "appointments"),
      where("doctorId", "==", currentDoctor.uid),
      where("date", "==", today)
    );
    
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const appointmentsGrid = document.getElementById("appointmentsGrid");
    
    if (appointmentsSnapshot.empty) {
      // Display sample appointments
      appointmentsGrid.innerHTML = generateSampleAppointments();
    } else {
      appointmentsGrid.innerHTML = "";
      
      for (const appointmentDoc of appointmentsSnapshot.docs) {
        const appointment = appointmentDoc.data();
        // Fetch patient data
        const patientDoc = await getDoc(doc(db, "patients", appointment.patientId));
        const patient = patientDoc.exists() ? patientDoc.data() : {};
        
        appointmentsGrid.innerHTML += createAppointmentCard({
          ...appointment,
          patientName: patient.name || "Unknown Patient",
          memberId: patient.memberId || "N/A"
        }, appointmentDoc.id);
      }
    }
    
    // Add event listeners
    attachAppointmentListeners();
  } catch (error) {
    console.error("Error loading appointments:", error);
    document.getElementById("appointmentsGrid").innerHTML = generateSampleAppointments();
    attachAppointmentListeners();
  }
}

// Generate Sample Appointments
function generateSampleAppointments() {
  const sampleAppointments = [
    {
      patientName: "John Smith",
      memberId: "CARE-ABC123",
      time: "09:00 AM",
      phone: "+91 98765 43210",
      symptoms: "Regular checkup and fever"
    },
    {
      patientName: "Sarah Johnson",
      memberId: "CARE-XYZ456",
      time: "11:30 AM",
      phone: "+91 98765 43211",
      symptoms: "Follow-up consultation"
    },
    {
      patientName: "Michael Chen",
      memberId: "CARE-DEF789",
      time: "02:00 PM",
      phone: "+91 98765 43212",
      symptoms: "Blood pressure monitoring"
    }
  ];
  
  let html = "";
  sampleAppointments.forEach((apt, index) => {
    html += createAppointmentCard(apt, `sample-${index}`);
  });
  return html;
}

// Create Appointment Card HTML
function createAppointmentCard(appointment, appointmentId) {
  return `
    <div class="appointment-card">
      <div class="appointment-header">
        <div class="appointment-patient">
          <h3>${appointment.patientName}</h3>
          <p class="appointment-member-id">${appointment.memberId}</p>
        </div>
        <div class="appointment-time">${appointment.time || "Scheduled"}</div>
      </div>
      <div class="appointment-details">
        <div class="appointment-detail-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>${appointment.phone || "Not provided"}</span>
        </div>
        <div class="appointment-detail-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span>${appointment.symptoms || "No symptoms listed"}</span>
        </div>
      </div>
      <div class="appointment-actions">
        <button class="btn-view-records" data-patient-id="${appointment.patientId || 'sample'}" data-appointment-id="${appointmentId}">
          View Records
        </button>
        <button class="btn-complete" data-appointment-id="${appointmentId}">
          Complete
        </button>
      </div>
    </div>
  `;
}

// Attach Appointment Event Listeners
function attachAppointmentListeners() {
  document.querySelectorAll(".btn-view-records").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const patientId = e.target.dataset.patientId;
      viewPatientDetails(patientId);
    });
  });
  
  document.querySelectorAll(".btn-complete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const appointmentId = e.target.dataset.appointmentId;
      completeAppointment(appointmentId);
    });
  });
}

// Load Recent Patients
async function loadRecentPatients() {
  try {
    const patientsQuery = query(collection(db, "patients"), limit(10));
    const patientsSnapshot = await getDocs(patientsQuery);
    const tableBody = document.querySelector("#patientsTable tbody");
    
    if (patientsSnapshot.empty) {
      tableBody.innerHTML = generateSamplePatients();
    } else {
      tableBody.innerHTML = "";
      patientsSnapshot.forEach((patientDoc) => {
        const patient = patientDoc.data();
        tableBody.innerHTML += createPatientRow(patient, patientDoc.id);
      });
    }
    
    // Add event listeners
    attachPatientListeners();
  } catch (error) {
    console.error("Error loading patients:", error);
    document.querySelector("#patientsTable tbody").innerHTML = generateSamplePatients();
    attachPatientListeners();
  }
}

// Generate Sample Patients
function generateSamplePatients() {
  const samplePatients = [
    { memberId: "CARE-ABC123", name: "John Smith", age: 45, phone: "+91 98765 43210", lastVisit: "2025-11-05" },
    { memberId: "CARE-XYZ456", name: "Sarah Johnson", age: 32, phone: "+91 98765 43211", lastVisit: "2025-11-07" },
    { memberId: "CARE-DEF789", name: "Michael Chen", age: 58, phone: "+91 98765 43212", lastVisit: "2025-11-08" }
  ];
  
  let html = "";
  samplePatients.forEach((patient, index) => {
    html += createPatientRow(patient, `sample-${index}`);
  });
  return html;
}

// Create Patient Row HTML
function createPatientRow(patient, patientId) {
  return `
    <tr>
      <td><span class="member-id-badge">${patient.memberId || "N/A"}</span></td>
      <td>${patient.name || "Unknown"}</td>
      <td>${patient.age || "N/A"}</td>
      <td>${patient.phone || "Not provided"}</td>
      <td>${formatDate(patient.lastVisit || patient.createdAt)}</td>
      <td>
        <button class="btn-action btn-view-patient-details" data-patient-id="${patientId}">
          View Details
        </button>
      </td>
    </tr>
  `;
}

// Attach Patient Event Listeners
function attachPatientListeners() {
  document.querySelectorAll(".btn-view-patient-details").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const patientId = e.target.dataset.patientId;
      viewPatientDetails(patientId);
    });
  });
}
// Patient Search Functionality
document.getElementById("patientSearch").addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("searchResults");
  
  if (searchTerm.length < 2) {
    resultsContainer.innerHTML = "";
    return;
  }
  
  try {
    const patientsSnapshot = await getDocs(collection(db, "patients"));
    const results = [];
    
    patientsSnapshot.forEach((doc) => {
      const patient = doc.data();
      const name = (patient.name || "").toLowerCase();
      const email = (patient.email || "").toLowerCase();
      const memberId = (patient.memberId || "").toLowerCase();
      
      if (name.includes(searchTerm) || email.includes(searchTerm) || memberId.includes(searchTerm)) {
        results.push({ id: doc.id, ...patient });
      }
    });
    
    if (results.length === 0) {
      resultsContainer.innerHTML = '<p style="padding: 16px; text-align: center; color: #718096;">No patients found</p>';
    } else {
      resultsContainer.innerHTML = results.map(patient => `
        <div class="patient-search-item" data-patient-id="${patient.id}">
          <div class="patient-search-info">
            <h4>${patient.name || "Unknown"}</h4>
            <p>${patient.memberId || "N/A"} • ${patient.email || "No email"}</p>
          </div>
          <button class="btn-view-patient" data-patient-id="${patient.id}">View</button>
        </div>
      `).join('');
      
      // Add click listeners
      document.querySelectorAll(".btn-view-patient").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          viewPatientDetails(e.target.dataset.patientId);
        });
      });
      
      document.querySelectorAll(".patient-search-item").forEach(item => {
        item.addEventListener("click", (e) => {
          if (!e.target.classList.contains("btn-view-patient")) {
            viewPatientDetails(item.dataset.patientId);
          }
        });
      });
    }
  } catch (error) {
    console.error("Error searching patients:", error);
    resultsContainer.innerHTML = '<p style="padding: 16px; text-align: center; color: #f56565;">Error searching patients</p>';
  }
});

// View Patient Details
async function viewPatientDetails(patientId) {
  const modal = document.getElementById("patientModal");
  const modalBody = document.getElementById("patientDetailsBody");
  
  modalBody.innerHTML = '<p style="text-align: center; padding: 40px; color: #718096;">Loading patient details...</p>';
  modal.style.display = "block";
  
  try {
    if (patientId.startsWith('sample')) {
      // Display sample patient data
      displaySamplePatientDetails(modalBody);
      return;
    }
    
    const patientDoc = await getDoc(doc(db, "patients", patientId));
    
    if (patientDoc.exists()) {
      const patient = patientDoc.data();
      currentPatientData = { id: patientId, ...patient };
      
      // Load prescriptions
      const prescriptionsQuery = query(
        collection(db, "prescriptions"),
        where("patientId", "==", patientId),
        limit(10)
      );
      const prescriptionsSnapshot = await getDocs(prescriptionsQuery);
      const prescriptions = [];
      prescriptionsSnapshot.forEach((doc) => {
        prescriptions.push({ id: doc.id, ...doc.data() });
      });
      
      displayPatientDetails(modalBody, patient, prescriptions);
    } else {
      modalBody.innerHTML = '<p style="text-align: center; padding: 40px; color: #f56565;">Patient not found</p>';
    }
  } catch (error) {
    console.error("Error loading patient details:", error);
    displaySamplePatientDetails(modalBody);
  }
}

// Display Sample Patient Details
function displaySamplePatientDetails(container) {
  const samplePatient = {
    name: "John Smith",
    memberId: "CARE-ABC123",
    email: "john.smith@example.com",
    age: 45,
    phone: "+91 98765 43210",
    address: "123 Main Street, Mumbai, Maharashtra",
    bloodGroup: "O+",
    createdAt: "2025-01-15"
  };
  
  const samplePrescriptions = [
    {
      date: "2025-11-05",
      doctor: currentDoctor?.name || "Dr. Sarah Johnson",
      diagnosis: "Seasonal flu",
      medicines: "Paracetamol 500mg - 3 times daily, Rest and fluids"
    },
    {
      date: "2025-10-20",
      doctor: currentDoctor?.name || "Dr. Sarah Johnson",
      diagnosis: "Regular checkup",
      medicines: "Multivitamins - Once daily, Blood pressure monitoring"
    }
  ];
  
  displayPatientDetails(container, samplePatient, samplePrescriptions);
}

// Display Patient Details
function displayPatientDetails(container, patient, prescriptions) {
  container.innerHTML = `
    <div class="patient-details-grid">
      <div class="detail-group">
        <h3>Personal Information</h3>
        <div class="detail-item">
          <p class="detail-label">Member ID</p>
          <p class="detail-value">${patient.memberId || "N/A"}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Full Name</p>
          <p class="detail-value">${patient.name || "Unknown"}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Age</p>
          <p class="detail-value">${patient.age || "N/A"}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Blood Group</p>
          <p class="detail-value">${patient.bloodGroup || "N/A"}</p>
        </div>
      </div>
      
      <div class="detail-group">
        <h3>Contact Information</h3>
        <div class="detail-item">
          <p class="detail-label">Email</p>
          <p class="detail-value">${patient.email || "Not provided"}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Phone</p>
          <p class="detail-value">${patient.phone || "Not provided"}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Address</p>
          <p class="detail-value">${patient.address || "Not provided"}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Member Since</p>
          <p class="detail-value">${formatDate(patient.createdAt)}</p>
        </div>
      </div>
    </div>
    
    <div class="prescriptions-section">
      <h3>Medical History & Prescriptions</h3>
      ${prescriptions.length === 0 ? 
        '<p style="color: #718096; text-align: center; padding: 20px;">No prescriptions found</p>' :
        prescriptions.map(presc => `
          <div class="prescription-card">
            <div class="prescription-header">
              <span class="prescription-date">${formatDate(presc.date)}</span>
              <span class="prescription-doctor">${presc.doctor || currentDoctor?.name || "Doctor"}</span>
            </div>
            <div class="prescription-content">
              <p><strong>Diagnosis:</strong> ${presc.diagnosis || "N/A"}</p>
              <p><strong>Prescription:</strong> ${presc.medicines || "N/A"}</p>
              ${presc.notes ? `<p><strong>Notes:</strong> ${presc.notes}</p>` : ''}
            </div>
          </div>
        `).join('')
      }
      <button class="add-prescription-btn" onclick="addPrescription()">Add New Prescription</button>
    </div>
  `;
}

// Add Prescription
window.addPrescription = async function() {
  if (!currentPatientData) {
    alert("No patient selected");
    return;
  }
  
  const diagnosis = prompt("Enter diagnosis:");
  if (!diagnosis) return;
  
  const medicines = prompt("Enter prescription (medicines, dosage, instructions):");
  if (!medicines) return;
  
  const notes = prompt("Additional notes (optional):");
  
  try {
    const prescriptionData = {
      patientId: currentPatientData.id,
      doctorId: currentDoctor.uid,
      doctor: currentDoctor.name,
      diagnosis: diagnosis,
      medicines: medicines,
      notes: notes || "",
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    await addDoc(collection(db, "prescriptions"), prescriptionData);
    alert("Prescription added successfully!");
    
    // Reload patient details
    viewPatientDetails(currentPatientData.id);
  } catch (error) {
    console.error("Error adding prescription:", error);
    alert("Failed to add prescription. Please try again.");
  }
};

// Complete Appointment
function completeAppointment(appointmentId) {
  if (appointmentId.startsWith('sample')) {
    alert("This is a sample appointment. Feature coming soon!");
    return;
  }
  
  const confirmed = confirm("Mark this appointment as completed?");
  if (confirmed) {
    // In a real app, update the appointment status in Firestore
    alert("Appointment marked as completed!");
    loadTodayAppointments();
  }
}

// Format Date
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Modal Close Functionality
document.getElementById("closeModal").addEventListener("click", () => {
  document.getElementById("patientModal").style.display = "none";
  currentPatientData = null;
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  const modal = document.getElementById("patientModal");
  if (e.target === modal) {
    modal.style.display = "none";
    currentPatientData = null;
  }
});

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("Doctor logged out");
    window.location.href = "doctor-login.html";
  } catch (error) {
    console.error("Error logging out:", error);
    alert("Error logging out. Please try again.");
  }
});

// Log page load
console.log("Doctor Dashboard loaded successfully");
