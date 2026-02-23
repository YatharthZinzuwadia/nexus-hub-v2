-- ============================================================================
-- FIX: STORAGE QUOTA RLS ERROR
-- ============================================================================
-- This migration fixes the 42501 error (RLS violation) on storage_quotas.
-- The trigger function needs to be SECURITY DEFINER to bypass user RLS
-- when updating system-managed usage counters.
-- ============================================================================

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
-- Added SECURITY DEFINER to fix RLS violation error 42501
-- This allows the trigger to update the quota even if the user doesn't have direct UPDATE access.
$$ LANGUAGE plpgsql SECURITY DEFINER;
