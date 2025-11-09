***

# CareSync Hospital Management System

A **modern web-based healthcare platform** for hospitals and clinics. Digitize patient records, manage appointments, and streamline doctor-patient interactions with powerful features and secure cloud technology.

***

## 🚀 Project Overview

- Digital patient & doctor record management (with QR member IDs)
- Online appointment booking for patients
- Doctor-patient communication & prescription sharing
- Secure document storage (Aadhaar, PAN, prescriptions, etc.)
- Real-time sync, authentication, and access control via Firebase

***

## 🏗️ Technology Stack

- **Frontend:** HTML5, CSS3, JavaScript ES6 (Vanilla)
- **Backend/Database:** Firebase Authentication, Cloud Firestore
- **Hosting:** Firebase Hosting
- **Libraries:** QRCode.js, Google Fonts (Poppins, Inter)
- **Dev Tools:** VS Code, Git, GitHub

***

## 🧑‍💻 Features

- **Dual Portal System:** Separate login and dashboard for patients & doctors
- **Authentication:** Secure email/password login and registration
- **Member ID Generation:** Auto-creates QR-coded patient IDs
- **Appointment System:** Patients book/see appointments, doctors manage schedule
- **Prescription Management:** Doctors add, patients view prescriptions
- **Role-Based Access:** Patients and doctors see the data meant for them
- **Responsive Design:** Works on desktop, tablet, mobile
- **Modern UI/UX:** Animated buttons, gradients, touch-friendly, accessible

***

## 📁 Project Structure

```
hospital-management-system/
├── public/           # Deployment folder (index.html, 404.html, assets)
├── src/
│   └── frontend/     # Main app files
│       ├── index.html        # Portal selection
│       ├── login.html        # Patient login
│       ├── signup.html       # Patient signup
│       ├── doctor-login.html
│       ├── doctor-signup.html
│       ├── patient-dashboard.html
│       ├── doctor-dashboard.html
│       ├── css/
│       │   ├── styles.css
│       │   ├── patient-dashboard.css
│       │   └── doctor-dashboard.css
│       ├── js/
│       │   ├── auth.js
│       │   ├── patient-dashboard.js
│       │   └── doctor-dashboard.js
├── firebase.json
├── firestore.rules
├── package.json
├── README.md
```

***

## 🏥 Main Modules

- **Authentication:** Patient/Doctor login, registration, password recovery
- **Dashboard:** Quick stats, QR code, appointments, doctor cards, patient cards
- **Appointment Table:** Book, cancel, see history, virtual consultation
- **Prescription Table:** Add/view prescriptions, download documents
- **Emergency Access:** Fast info for critical cases

***

## 🔒 Security

- Firebase Authentication for secure access
- Role-based access and Firestore rules for data safety
- Session management and UID verification
- Input validation, HTTPS, and SSL enforced

***

## 🎨 Design & Accessibility

- Professional color palette (White, blue, purple gradients for healthcare look)
- Large, accessible buttons (min 48x48px) for older users
- Animations, responsive layout, and clear navigation
- Screen reader-friendly, high-contrast support

***

## 🪄 How to Run Locally

1. Clone the repo:
   ```
   git clone https://github.com/aurorixsaad01/Hospital-Management-app.git
   ```
2. Set up Firebase (follow instructions in `firebase.json`)
3. Serve locally or deploy:
   ```
   firebase serve --only hosting
   ```
4. Access the app at (http://localhost:5000) or your Firebase Hosting domain

***

## 📅 Planned Features

- Admin dashboard
- Pharmacy & lab modules
- Billing, insurance, invoices
- Chat, notifications, reminders
- AI chatbot for symptom analysis
- Multi-hospital support, multi-language
- Flutter mobile app, offline mode

***

## 🥇 Credits & Author

Built by **Saad**  
Dell Vostro 3500 | Windows 11 | Core i5 11th Gen | 8GB RAM | NVIDIA MX330

***

## 📈 Project Stats

- 13+ files, 2700+ code lines
- 7 HTML pages, 3 CSS files, 3 JS files
- ~12 hours project build time

***

## ⚠️ License

This project is for learning/demo purposes only.

***