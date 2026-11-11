# AgriSense AI – Database Architecture & Schema Specification

AgriSense AI uses **Supabase PostgreSQL 15+** with **Row Level Security (RLS)** enabled across all tables, ensuring complete data isolation between farmers.

## Schema Overview

The database migration is located at `supabase/migrations/001_initial_schema.sql`.

```
                  ┌──────────────────────┐
                  │      auth.users      │
                  └──────────┬───────────┘
                             │ 1:1
                             ▼
                  ┌──────────────────────┐
                  │   public.profiles    │
                  └──────────┬───────────┘
                             │
            ┌────────────────┼────────────────────────┬──────────────────────┐
            │ 1:N            │ 1:N                    │ 1:N                  │ 1:N
            ▼                ▼                        ▼                      ▼
     ┌─────────────┐  ┌─────────────────────┐  ┌───────────────┐  ┌─────────────────────┐
     │    farms    │  │ crop_recommendations│  │disease_analyses│  │farming_cost_estimates│
     └──────┬──────┘  └─────────────────────┘  └───────────────┘  └─────────────────────┘
            │
            ├───────────────┐
            │ 1:N           │ 1:N
            ▼               ▼
┌──────────────────────┐  ┌─────────────────────┐
│   advisory_reports   │  │   weather_records   │
└──────────────────────┘  └─────────────────────┘
```

---

## Tables & Structures

### 1. `public.profiles`
- Primary Key: `id` (UUID references `auth.users(id)` ON DELETE CASCADE)
- Fields:
  - `full_name` (TEXT NOT NULL)
  - `phone` (TEXT)
  - `preferred_language` (TEXT CHECK ('en', 'ml') DEFAULT 'en')
  - `state`, `district`, `village` (TEXT)
  - `farm_name` (TEXT)
  - `land_area` (NUMERIC(12, 3) CHECK > 0)
  - `land_unit` (TEXT DEFAULT 'acre')
  - `farming_type` (TEXT)
  - `created_at`, `updated_at` (TIMESTAMPTZ)

### 2. `public.farms`
- Primary Key: `id` (UUID gen_random_uuid())
- Foreign Key: `user_id` (UUID references `auth.users(id)` ON DELETE CASCADE)
- Fields:
  - `farm_name` (TEXT NOT NULL)
  - `state`, `district`, `village` (TEXT)
  - `latitude`, `longitude` (DOUBLE PRECISION)
  - `land_area` (NUMERIC(12,3) NOT NULL CHECK > 0)
  - `land_unit` (TEXT DEFAULT 'acre')
  - `soil_type` (TEXT)
  - `soil_ph` (NUMERIC(4,2) CHECK 0-14)
  - `nitrogen`, `phosphorus`, `potassium` (NUMERIC(12,3))
  - `water_source` (TEXT)
  - `farming_method` (TEXT)

### 3. `public.crop_recommendations`
- Foreign Key: `user_id`, `farm_id`
- Fields: `input_data` (JSONB), `recommendations` (JSONB), `ai_model`, `language`

### 4. `public.advisory_reports`
- Unified archive table for all AI advisories.
- Fields: `advisory_type` CHECK in ('crop', 'disease', 'fertilizer', 'irrigation', 'weather', 'general'), `title`, `input_data` (JSONB), `result_data` (JSONB), `status`

### 5. `public.chat_conversations` & `public.chat_messages`
- Multi-turn conversation sessions with role ('user' | 'assistant'), text content, and metadata JSONB containing structured action steps and warnings.

### 6. `public.disease_analyses`
- Multimodal leaf diagnosis records: `image_path`, `crop_name`, `symptoms`, `analysis_result` (JSONB), `ai_model`.

### 7. `public.farming_cost_estimates`
- Deterministic economic calculations: `total_cost`, `expected_revenue`, `estimated_profit`, `expenses` (JSONB), `currency`.

### 8. `public.weather_records`
- Atmospheric telemetry archive: `temperature`, `humidity`, `rainfall`, `wind_speed`, `provider`, `recorded_at`.

---

## Row Level Security (RLS) Policy Rules

Every table has RLS explicitly enabled:
- **Profiles:** Users can SELECT, INSERT, UPDATE only where `auth.uid() = id`.
- **Farms:** Users can SELECT, INSERT, UPDATE, DELETE only where `auth.uid() = user_id`.
- **Advisory Reports, Recommendations, Diagnoses, Estimates:** Strict user isolation matching `auth.uid() = user_id`.
- **Chat Messages:** Users can only read/write messages in conversations where `conversation.user_id = auth.uid()`.

