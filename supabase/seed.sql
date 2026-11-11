-- ====================================================================
-- AgriSense AI: Seed / Reference Data
-- Context: Regional and Indian Agricultural Reference Baselines
-- ====================================================================

-- Note: Seed data creates standard lookup definitions or sample structures for testing.
-- Storage Bucket configuration note:
-- The bucket 'crop-diagnosis-images' should be created in Supabase Storage with RLS.
-- Insert a comment block for Supabase storage SQL setup:
/*
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-diagnosis-images', 'crop-diagnosis-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload crop diagnosis images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'crop-diagnosis-images');

CREATE POLICY "Anyone can view crop diagnosis images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'crop-diagnosis-images');
*/
