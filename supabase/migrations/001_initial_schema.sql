-- ====================================================================
-- AgriSense AI: PostgreSQL Database Schema Migration
-- Migration 001: Initial Schema, Indexes, Triggers, and RLS Policies
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES TABLE
-- Stores user personal details, regional preferences, and agricultural baseline.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    state TEXT,
    district TEXT,
    village TEXT,
    farm_name TEXT,
    land_area NUMERIC(12, 3),
    land_unit TEXT DEFAULT 'acre',
    farming_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT valid_land_area CHECK (land_area IS NULL OR land_area > 0),
    CONSTRAINT valid_language CHECK (preferred_language IN ('en', 'ml'))
);

-- 3. FARMS TABLE
-- Specific farm land parcels/plots owned by the user
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    village TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    land_area NUMERIC(12, 3) NOT NULL,
    land_unit TEXT NOT NULL DEFAULT 'acre',
    soil_type TEXT,
    soil_ph NUMERIC(4, 2),
    nitrogen NUMERIC(12, 3),
    phosphorus NUMERIC(12, 3),
    potassium NUMERIC(12, 3),
    water_source TEXT,
    farming_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT positive_area CHECK (land_area > 0),
    CONSTRAINT valid_ph CHECK (soil_ph IS NULL OR (soil_ph >= 0 AND soil_ph <= 14))
);

-- 4. CROP RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    input_data JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    ai_model TEXT,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ADVISORY REPORTS TABLE
-- Unified log for fertilizer, irrigation, weather, crop, and general advice reports
CREATE TABLE IF NOT EXISTS public.advisory_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    advisory_type TEXT NOT NULL,
    title TEXT NOT NULL,
    input_data JSONB NOT NULL,
    result_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_advisory_type CHECK (
        advisory_type IN ('crop', 'disease', 'fertilizer', 'irrigation', 'weather', 'general')
    )
);

-- 6. CHAT CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Conversation',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CHAT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_role CHECK (role IN ('user', 'assistant'))
);

-- 8. DISEASE ANALYSES TABLE
CREATE TABLE IF NOT EXISTS public.disease_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    image_path TEXT NOT NULL,
    symptoms TEXT,
    analysis_result JSONB NOT NULL,
    ai_model TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. FARMING COST ESTIMATES TABLE
CREATE TABLE IF NOT EXISTS public.farming_cost_estimates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    land_area NUMERIC(12, 3) NOT NULL,
    land_unit TEXT NOT NULL DEFAULT 'acre',
    expenses JSONB NOT NULL,
    total_cost NUMERIC(14, 2) NOT NULL,
    expected_revenue NUMERIC(14, 2),
    estimated_profit NUMERIC(14, 2),
    currency TEXT NOT NULL DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT positive_cost_area CHECK (land_area > 0),
    CONSTRAINT nonnegative_cost CHECK (total_cost >= 0)
);

-- 10. WEATHER RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.weather_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    location_name TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    temperature NUMERIC(6, 2),
    humidity NUMERIC(6, 2),
    rainfall NUMERIC(8, 2),
    wind_speed NUMERIC(8, 2),
    weather_description TEXT,
    provider TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user_id ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_advisory_reports_user_id ON public.advisory_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_analyses_user_id ON public.disease_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_user_id ON public.farming_cost_estimates(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_user_recorded ON public.weather_records(user_id, recorded_at DESC);

-- ====================================================================
-- TRIGGERS: UPDATED_AT TIMESTAMP REFRESH
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER update_farms_modtime
    BEFORE UPDATE ON public.farms
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER update_chat_conversations_modtime
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ====================================================================
-- TRIGGER: AUTO PROFILE CREATION ON USER REGISTRATION
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        preferred_language,
        state,
        district
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en'),
        NEW.raw_user_meta_data->>'state',
        NEW.raw_user_meta_data->>'district'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if exists to prevent duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farming_cost_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. Farms Policies
CREATE POLICY "Users can view own farms"
    ON public.farms FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms"
    ON public.farms FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms"
    ON public.farms FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms"
    ON public.farms FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 3. Crop Recommendations Policies
CREATE POLICY "Users can access own crop recommendations"
    ON public.crop_recommendations FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Advisory Reports Policies
CREATE POLICY "Users can access own advisory reports"
    ON public.advisory_reports FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Chat Conversations Policies
CREATE POLICY "Users can access own chat conversations"
    ON public.chat_conversations FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Chat Messages Policies
CREATE POLICY "Users can access own chat messages"
    ON public.chat_messages FOR ALL TO authenticated
    USING (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.chat_conversations c
            WHERE c.id = conversation_id AND c.user_id = auth.uid()
        )
    )
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM public.chat_conversations c
            WHERE c.id = conversation_id AND c.user_id = auth.uid()
        )
    );

-- 7. Disease Analyses Policies
CREATE POLICY "Users can access own disease analyses"
    ON public.disease_analyses FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Farming Cost Estimates Policies
CREATE POLICY "Users can access own cost estimates"
    ON public.farming_cost_estimates FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 9. Weather Records Policies
CREATE POLICY "Users can access own weather records"
    ON public.weather_records FOR ALL TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
