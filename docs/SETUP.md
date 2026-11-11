# AgriSense AI – Local Development & Setup Guide

This guide details how to install, configure, and launch AgriSense AI on your local machine.

## Prerequisites
- **Node.js**: v20+ LTS or v22+
- **npm**: v10+
- **Supabase Account**: (Free tier at supabase.com)
- **Google Gemini API Key**: (Get one at aistudio.google.com)

---

## Step 1: Clone & Monorepo Setup

```bash
git clone <repository-url>
cd "Antigravity project"
```

---

## Step 2: Supabase Database Migration

1. Log into your Supabase Dashboard and create a new project.
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Open `supabase/migrations/001_initial_schema.sql` from this repository, copy its entire contents, paste it into the SQL Editor, and click **Run**.
4. Open **Storage** in the Supabase Dashboard:
   - Create a bucket named `crop-diagnosis-images`.
   - Set the bucket to **Public** (or configure signed URL policies).

---

## Step 3: Backend Configuration & Startup

1. Open a terminal in the `server` directory:
   ```bash
   cd server
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Populate `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:5173

   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Gemini API
   GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
   GEMINI_MODEL=gemini-2.5-flash

   # Weather API (Optional - defaults to regional agro-baseline if omitted)
   WEATHER_API_KEY=your-openweather-key
   ```
4. Install server dependencies and run the development server:
   ```bash
   npm install
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

---

## Step 4: Frontend Configuration & Startup

1. Open a second terminal in the `client` directory:
   ```bash
   cd client
   ```
2. Copy the client environment template:
   ```bash
   cp .env.example .env
   ```
3. Populate `client/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
4. Install client packages and run Vite:
   ```bash
   npm install
   npm run dev
   ```
   *The frontend will start on `http://localhost:5173`.*

---

## Step 5: Instant Testing & Demo Sandbox

1. Open your browser at `http://localhost:5173`.
2. On the login or landing page, click **"Try Instant Demo"**.
3. You will immediately access the Farmer Dashboard preloaded with sample Kerala farm plots, real-time meteorological metrics, crop recommendations, and plant disease scanning!

