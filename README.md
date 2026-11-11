# 🌱 AgriSense AI – Intelligent Agricultural Advisory Assistant

> **A production-ready, full-stack, AI-powered agricultural advisory platform designed for farmers, agronomists, and agricultural cooperatives. Combines soil chemistry analysis, multimodal plant pathology vision, climate-smart irrigation scheduling, and deterministic farm economics with English & Malayalam vernacular support.**

---

## 🌟 Key Features

1. **🌾 Smart Crop Recommendation Engine:**
   - Evaluates soil nitrogen (N), phosphorus (P), potassium (K), pH, season, and water sources to produce ranked crop suitability matches with 0–100% scores and agronomic rationales.
2. **🩺 Multimodal Plant Pathology Doctor:**
   - Upload leaf/stem/fruit photos for instant disease diagnosis via Gemini Vision (`gemini-2.5-flash`), with Integrated Pest Management (IPM) recommendations (cultural, biological, and chemical) and audio synthesis.
3. **🧪 Stage-Specific Fertilizer Advisory:**
   - Phenological nutrient schedules (Basal, Vegetative, Flowering, Fruiting) with exact dosages and organic alternatives (vermicompost, Jeevamrutha).
4. **💧 Climate-Smart Irrigation Scheduler:**
   - Balances evapotranspiration rates with local rainfall forecasts to prevent water stress and conserve groundwater.
5. **⛅ Real-Time Agro-Weather Intelligence:**
   - Evaluates atmospheric humidity, temperature, and wind to generate operational agricultural risk alerts (fungal spore alerts, spray drift precautions).
6. **💰 Deterministic Cultivation Cost Estimator:**
   - Zero hallucination arithmetic calculating total production expenses, revenue projections, net margins, and cost-benefit ratios.
7. **🤖 Multilingual Agronomic Chatbot (Dr. Ceres):**
   - Context-aware agricultural assistant with conversation history, supporting English and Malayalam with Web Speech API audio vocalization.
8. **📍 Multi-Plot Farm Management:**
   - Register farm plots with soil baselines and irrigation hardware to auto-populate advisory calculators.
9. **📜 Chronological Advisory Archive:**
   - Searchable, filterable audit log of all previous soil tests, disease analyses, and schedules with deletion capabilities.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, TanStack Query v5, React Hook Form, Zod, Axios |
| **Backend** | Node.js, Express.js, TypeScript, Helmet, CORS, Morgan, Express Rate Limit, Multer |
| **AI / LLM SDK** | Official `@google/genai` SDK (`gemini-2.5-flash` with native JSON Schema output) |
| **Database & Auth** | Supabase PostgreSQL 15+, Supabase Auth, Row Level Security (RLS), Supabase Storage |
| **Audio / TTS** | Web Speech API synthesis wrapper (English & Malayalam) |

---

## 📁 Project Architecture

```text
agrisense-ai/
├── client/                     # React 18 + Vite Frontend
│   ├── src/
│   │   ├── components/         # Modular UI (crops, disease, dashboard, layout)
│   │   ├── contexts/           # AuthContext (Supabase + Demo login)
│   │   ├── i18n/               # English (en.json) & Malayalam (ml.json) translations
│   │   ├── pages/              # 16 Application Pages
│   │   ├── services/           # Axios client with JWT interceptor
│   │   └── utils/              # Web Speech API wrapper
│   ├── package.json
│   └── vite.config.ts
├── server/                     # Express.js + TypeScript Backend
│   ├── database/
│   │   └── schema.sql          # PostgreSQL DDL with RLS & Triggers
│   ├── src/
│   │   ├── config/             # Gemini, Supabase, Weather, Env validation
│   │   ├── controllers/        # REST Route Controllers
│   │   ├── middleware/         # Auth, RateLimiter, Upload, ErrorHandler
│   │   ├── prompts/            # AgriSense System & Task Prompts with JSON Schemas
│   │   ├── routes/             # REST Endpoints mounted under /api/v1
│   │   ├── services/           # Gemini, Weather, Disease Vision, Cost Services
│   │   └── validators/         # Zod Request & AI Response Schemas
│   ├── package.json
│   └── tsconfig.json
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── docs/                       # Comprehensive Technical Docs
│   ├── API.md
│   ├── DATABASE.md
│   ├── SETUP.md
│   └── DEPLOYMENT.md
├── package.json                # Monorepo Scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database Setup (Supabase)
Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL Editor and create a public storage bucket named `crop-diagnosis-images`.

### 2. Backend Startup
```bash
cd server
cp .env.example .env
# Fill in GEMINI_API_KEY and SUPABASE credentials in server/.env
npm install
npm run dev
```
Backend runs at `http://localhost:5000/api/v1`.

### 3. Frontend Startup
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 4. Instant Demo Mode
Open `http://localhost:5173` and click **"Try Instant Demo"** to access the system preloaded with sample Kerala agricultural data without needing immediate cloud credentials.

---

## 🔒 Security Hardening

- **Zero Secrets on Client:** Gemini API Key and Supabase Service Role Key are strictly contained on the Node.js backend.
- **Row Level Security (RLS):** Policies on all tables guarantee users cannot access other farmers' plots or diagnostic logs.
- **File Upload Guards:** Multer memory storage enforces a 5MB limit and rejects non-image MIME types before invoking AI models.
- **Deterministic Math:** Financial revenue and profit metrics are calculated in code, never generated via LLM hallucination.

---

## 📄 License
MIT © AgriSense AI Team

