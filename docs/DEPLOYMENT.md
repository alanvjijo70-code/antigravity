# AgriSense AI – Production Deployment Guide

This document describes how to deploy the AgriSense AI application across production cloud providers.

## Architecture Topology

```
[ Farmer Browser / Mobile ]
            │
            ├─────────────────────────────────────────┐
            ▼                                         ▼
[ Vercel / Netlify Frontend ]             [ Supabase PostgreSQL + Auth ]
     (React 18 + Vite)                     - Row Level Security (RLS)
            │                              - Storage: crop-diagnosis-images
            ▼
[ Render / Railway Backend ]
     (Node.js + Express)
            │
            ▼
[ Google Gemini AI (Official @google/genai SDK) ]
```

---

## 1. Database Deployment (Supabase)

1. Create a production Supabase project.
2. In the **SQL Editor**, execute `supabase/migrations/001_initial_schema.sql`.
3. In **Storage**, create bucket `crop-diagnosis-images`.
4. Copy:
   - `Project URL`
   - `anon / public key`
   - `service_role key` (keep private on backend only).

---

## 2. Backend Deployment (Render or Railway)

### Using Render:
1. Connect your Git repository.
2. Select **Web Service**.
3. Set:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or `10000`)
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-supabase-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-supabase-service-key`
   - `GEMINI_API_KEY`: `your-gemini-key`
   - `GEMINI_MODEL`: `gemini-2.5-flash`
   - `WEATHER_API_KEY`: `your-openweather-key`

---

## 3. Frontend Deployment (Vercel)

### Using Vercel:
1. Import your Git repository into Vercel.
2. Set:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
4. Deploy!

---

## 4. Production Security Verification Checklist

- [x] No `GEMINI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` exposed in client bundle.
- [x] CORS restricted to verified frontend origin.
- [x] Helmet headers active.
- [x] Rate limiting active on AI endpoints (20 req / 5 min).
- [x] Image file uploads capped at 5MB with MIME-type enforcement.
- [x] Supabase Row Level Security (RLS) active on every table.

