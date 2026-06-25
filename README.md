# PortAID — Portable Digital Identity Wallet

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20PortAID-orange?style=for-the-badge)](https://hackathon-62eh.vercel.app/)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge)](https://hackathon-62eh.vercel.app/)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge)](https://hackathon-0oig.onrender.com/)

PortAID is a full-stack digital identity wallet that allows users to upload, manage, verify, and share identity details through a secure KYC-style workflow.

Users can upload an identity document, extract text using OCR, review and edit the extracted details, complete a camera-based face detection step, confirm their identity information, and view a calculated trust score in the wallet dashboard.

> **Live Demo:** https://hackathon-62eh.vercel.app/

> **Disclaimer:** PortAID is an educational and portfolio project. It is not a production KYC system and must not be used for official government identity verification.

---

## Live Deployment

| Service | URL |
|---|---|
| Frontend | https://hackathon-62eh.vercel.app/ |
| Backend API | https://hackathon-0oig.onrender.com/ |
| Backend Health Check | https://hackathon-0oig.onrender.com/health |

---

## Features

- User authentication with MongoDB
- Secure JWT-based login flow
- Identity Wallet dashboard
- Government ID document upload
- Aadhaar Card, PAN Card, Passport, and Driving License options
- OCR-based text extraction from JPG, JPEG, and PNG files
- Editable OCR-extracted details
- PDF upload support for the verification workflow
- Camera access for face verification
- MediaPipe-based face detection
- Demo liveness verification flow
- Review and confirm identity details
- Dynamic trust score calculation
- Masked document-number display
- Identity-sharing interface
- Consent-management interface
- Recent activity interface
- Responsive dark UI
- Deployed frontend and backend integration

---

## Verification Workflow

 text
Upload Government ID
        ↓
OCR reads document text
        ↓
User reviews and corrects extracted details
        ↓
Face detection using browser camera
        ↓
Review and confirm identity details
        ↓
Trust score calculation
        ↓
Identity Wallet dashboard update
Tech Stack
Frontend
Next.js 15
React 19
TypeScript
Tailwind CSS
Tesseract.js
MediaPipe Tasks Vision
Lucide React
Heroicons
Recharts
Vercel Deployment
Backend
Node.js
Express.js
MongoDB Atlas
Mongoose
JWT Authentication
bcryptjs
dotenv
CORS
Render Deployment
Project Structure
portaid-main/
│
├── src/
│   ├── app/
│   │   ├── identity-wallet-dashboard/
│   │   ├── identity-verification-onboarding/
│   │   │   └── components/
│   │   │       ├── StepUploadID.tsx
│   │   │       ├── StepFaceScan.tsx
│   │   │       ├── StepConfirm.tsx
│   │   │       └── VerificationWizard.tsx
│   │   └── login/
│   │
│   ├── components/
│   ├── lib/
│   │   └── trustScore.ts
│   └── styles/
│
├── node-backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
├── package.json
├── next.config.mjs
└── README.md
Installation
1. Clone the Repository
git clone https://github.com/Padmaganesh14/portaid.git
cd portaid
2. Install Frontend Dependencies
npm install
3. Install OCR and Face Detection Packages
npm install tesseract.js
npm install @mediapipe/tasks-vision
npm install pdfjs-dist
4. Create Frontend Environment File

Create a .env.local file in the root folder:

NEXT_PUBLIC_API_URL=http://localhost:5000
5. Run the Frontend
npm run dev

Frontend runs at:

http://localhost:4028
Backend Setup

Go to the backend folder:

cd node-backend

Install backend dependencies:

npm install

Create a .env file inside the node-backend folder:

MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
CORS_ORIGIN=http://localhost:4028
JWT_SECRET=your_long_random_jwt_secret
ENCRYPTION_KEY=your_32_character_encryption_key

Run the backend:

node server.js

Backend runs at:

http://localhost:5000

Health check:

http://localhost:5000/health
Deployment Environment Variables
Vercel Frontend
NEXT_PUBLIC_API_URL=https://hackathon-0oig.onrender.com
Render Backend
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_long_random_jwt_secret
ENCRYPTION_KEY=your_32_character_encryption_key
CORS_ORIGIN=https://hackathon-62eh.vercel.app

Do not add a trailing / to CORS_ORIGIN.

OCR Document Scanning

PortAID uses Tesseract.js for OCR scanning.

Supported OCR Formats
JPG
JPEG
PNG
OCR Extracts
Full Name
Date of Birth
Document Number
Address

OCR results may not always be accurate because document image quality, lighting, blur, font size, and document layout affect recognition.

Users can manually review and correct extracted fields before continuing.

PDF Upload

PDF files can be uploaded in the verification workflow.

Current PDF Behavior
PDF upload is supported
PDF OCR requires converting PDF pages into images before Tesseract scanning
Full PDF OCR conversion can be added as a future enhancement
Face Verification

PortAID uses the browser camera and MediaPipe Face Landmarker.

Current Demo Checks
Browser camera permission
Live camera preview
Face visibility
Face landmark detection
Important Note

The current face-verification feature confirms that a face is visible in the live camera.

It does not currently provide:

Government-grade KYC verification
Aadhaar or PAN validation
ID-photo-to-live-face matching
Advanced anti-spoofing detection
Legal biometric verification
Trust Score

The trust score is calculated from available identity-verification information.

Verification Item	Score
Document uploaded	20
Full name available	15
Date of birth available	15
Document number available	20
Address available	10
Face detected	20
Maximum Score	100
Trust Score Labels
Score Range	Status
85–100	Excellent
65–84	Good
40–64	Partial
0–39	Not Verified
Security Considerations

For a production identity-verification system:

Never store raw Aadhaar, PAN, passport, or driving-license documents without explicit user consent.
Encrypt sensitive identity data before saving it to the database.
Mask document numbers in the UI.
Delete temporary uploaded files after OCR processing.
Use HTTPS for all frontend and backend communication.
Store database URLs, JWT secrets, and encryption keys only in environment variables.
Use secure authentication and authorization.
Use regulated KYC providers for real identity verification.
Do not treat OCR or basic face detection as legal identity verification.
Future Improvements
PDF-to-image conversion for PDF OCR
Better Aadhaar, PAN, Passport, and Driving License field extraction
Multi-language OCR support
Tamil and Hindi document OCR support
Blink detection for liveness verification
Head-turn liveness challenge
Smile detection
Live-face and ID-photo comparison
Encrypted document storage
Secure consent-management backend
QR-based identity sharing
MongoDB activity logs
Admin dashboard
Email verification
IPFS-based consent-controlled identity sharing
Screens and Modules
Identity Wallet Dashboard
Displays verified identity details
Shows masked document numbers
Shows verification status
Shows trust score
Displays recent identity activity
Displays active consents
Provides identity-sharing UI
Identity Verification Onboarding
Upload Government ID
OCR extraction
Edit extracted details
Face detection
Review and confirm
Wallet dashboard update
Author

Padma Ganesh P

GitHub: https://github.com/Padmaganesh14
Project: PortAID — Portable Digital Identity Wallet
Live Demo: https://hackathon-62eh.vercel.app/
License

This project is created for educational, hackathon, and portfolio purposes.
