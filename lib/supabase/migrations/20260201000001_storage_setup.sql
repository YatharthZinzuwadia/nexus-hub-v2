-- ============================================================================
-- STORAGE BUCKETS & POLICIES
-- ============================================================================
-- This migration creates Supabase Storage buckets and their access policies
-- for file uploads/downloads in NexusHub v2.
-- ============================================================================

-- ============================================================================
-- 1. CREATE STORAGE BUCKETS
-- ============================================================================

-- Bucket: avatars (user profile pictures)
-- Public bucket with image optimization
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true, -- Public bucket (anyone can read)
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket: project-assets (project images, screenshots, etc.)
-- Private bucket for project-related files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-assets',
  'project-assets',
  false, -- Private bucket
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'video/mp4', 'video/webm']
)
ON CONFLICT (id) DO NOTHING;

-- Bucket: files (general file storage)
-- Private bucket for user uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'files',
  'files',
  false, -- Private bucket
  104857600, -- 100MB limit
  NULL -- Allow all file types
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. STORAGE POLICIES - AVATARS BUCKET
-- ============================================================================

-- Policy: Anyone can view avatars (public bucket)
CREATE POLICY "Avatars are publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Policy: Users can upload their own avatar
-- Path format: {user_id}/avatar.{ext}
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- 3. STORAGE POLICIES - PROJECT-ASSETS BUCKET
-- ============================================================================

-- Policy: Users can view their own project assets
CREATE POLICY "Users can view own project assets"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'project-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can upload project assets
-- Path format: {user_id}/{project_id}/{filename}
CREATE POLICY "Users can upload project assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own project assets
CREATE POLICY "Users can update own project assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'project-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'project-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own project assets
CREATE POLICY "Users can delete own project assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project-assets' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- 4. STORAGE POLICIES - FILES BUCKET
-- ============================================================================

-- Policy: Users can view their own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can upload files
-- Path format: {user_id}/{filename} or {user_id}/{folder}/{filename}
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- ============================================================================
-- 5. HELPER FUNCTIONS FOR FILE MANAGEMENT
-- ============================================================================

-- Function: Get total storage used by a user
CREATE OR REPLACE FUNCTION public.get_user_storage_bytes(user_uuid UUID)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(size_bytes), 0)
    FROM public.files
    WHERE user_id = user_uuid AND type = 'file'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_storage_bytes IS 'Calculate total storage used by a user in bytes';

-- Function: Clean up orphaned storage objects
-- This can be run periodically to remove files in storage that don't have
-- corresponding entries in the files table
CREATE OR REPLACE FUNCTION public.cleanup_orphaned_storage_objects()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- This would need to be implemented with Storage API calls
  -- For now, this is a placeholder
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.cleanup_orphaned_storage_objects IS 'Remove storage objects without database entries';

-- ============================================================================
-- 6. STORAGE QUOTAS (Optional - for future use)
-- ============================================================================

-- Table: Storage quotas per user
CREATE TABLE IF NOT EXISTS public.storage_quotas (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  quota_bytes BIGINT NOT NULL DEFAULT 1073741824, -- 1GB default
  used_bytes BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.storage_quotas IS 'Storage quotas and usage tracking per user';
COMMENT ON COLUMN public.storage_quotas.quota_bytes IS 'Maximum storage allowed in bytes';
COMMENT ON COLUMN public.storage_quotas.used_bytes IS 'Current storage used in bytes';

-- RLS for storage_quotas
ALTER TABLE public.storage_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own storage quota"
ON public.storage_quotas FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Trigger: Update storage quota on file insert/update/delete
CREATE OR REPLACE FUNCTION update_storage_quota()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.type = 'file' THEN
    INSERT INTO public.storage_quotas (user_id, used_bytes)
    VALUES (NEW.user_id, NEW.size_bytes)
    ON CONFLICT (user_id)
    DO UPDATE SET
      used_bytes = storage_quotas.used_bytes + NEW.size_bytes,
      updated_at = NOW();

  ELSIF TG_OP = 'UPDATE' AND NEW.type = 'file' THEN
    UPDATE public.storage_quotas
    SET
      used_bytes = used_bytes - OLD.size_bytes + NEW.size_bytes,
      updated_at = NOW()
   WHERE user_id = NEW.user_id;

  ELSIF TG_OP = 'DELETE' AND OLD.type = 'file' THEN
    UPDATE public.storage_quotas
    SET
      used_bytes = GREATEST(0, used_bytes - OLD.size_bytes),
      updated_at = NOW()
    WHERE user_id = OLD.user_id;
  END IF;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to files table
CREATE TRIGGER update_user_storage_quota
AFTER INSERT OR UPDATE OR DELETE ON public.files
FOR EACH ROW EXECUTE FUNCTION update_storage_quota();

-- ============================================================================
-- END OF STORAGE MIGRATION
-- ============================================================================
