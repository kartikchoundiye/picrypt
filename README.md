# PICRYPT — Image Steganography & AES-256 Vault

[![Frontend Deployed](https://img.shields.io/badge/Frontend-Vercel-black?style=for-the-badge&logo=vercel)](https://picrypt-tau.vercel.app/)
[![Backend Deployed](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://picrypt.onrender.com/)

PICRYPT is a full-stack cybersecurity web application that combines military-grade **AES-256 encryption** with **LSB (Least Significant Bit) and APP-marker image steganography**. It allows users to imperceptibly conceal arbitrary secret payload files (text, code, archives, images, audio, video) inside standard carrier images.

---

## 🌐 Live Deployments

| Component | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel | [https://picrypt-tau.vercel.app/](https://picrypt-tau.vercel.app/) | ✅ Live |
| **Backend** | Render | [https://picrypt.onrender.com/](https://picrypt.onrender.com/) | ✅ Live |
| **Admin Panel** | Render | [https://picrypt.onrender.com/admin/](https://picrypt.onrender.com/admin/) | ✅ Live |

---

## 🚀 Architecture & Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Futuristic Cyberpunk / Dark Navy Theme `#070D1A`)
- **Animations**: Framer Motion + GSAP + Lottie Web
- **Routing & Networking**: React Router DOM + Axios
- **Hosting**: Vercel

### Backend
- **Framework**: Django 5 + Django REST Framework (DRF)
- **Security & Auth**: SimpleJWT (JSON Web Tokens), CORS Headers, Passlib / Cryptography
- **Core Engine**: Steghide CLI + Pillow (PIL) for carrier validation and payload embedding/extraction
- **Database**: SQLite (Development) / PostgreSQL compatible (Production)
- **Hosting**: Render (Gunicorn + WhiteNoise)

---

## ⚙️ Environment Variables

### Frontend (`frontend/.env`)
```env
# Production: Points to Render Backend
VITE_API_URL=https://picrypt.onrender.com/api

# Local Development: Points to Local Django Server
# VITE_API_URL=http://localhost:8000/api
```

### Backend (`backend/.env`)
```env
DEBUG=False
DJANGO_SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=127.0.0.1,localhost,picrypt.onrender.com,.onrender.com
FRONTEND_URL=http://localhost:5173,https://picrypt-tau.vercel.app
CSRF_TRUSTED_ORIGINS=https://picrypt-tau.vercel.app,https://picrypt.onrender.com
```

---

## 💻 Local Development Setup

### 1. Backend Setup
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py runserver
```
Local backend runs at: `http://127.0.0.1:8000/`

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Local frontend runs at: `http://localhost:5173/`

