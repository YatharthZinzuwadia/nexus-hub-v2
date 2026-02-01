-- ============================================================================
-- NUCLEAR RESET - Complete Supabase Database Cleanup
-- ============================================================================
-- This script will DELETE EVERYTHING in the public schema
-- Safe to run even if tables/functions don't exist
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================

-- Step 1: Show what currently exists
-- ============================================================================
DO $$ 
BEGIN
  RAISE NOTICE '=== CURRENT DATABASE STATE ===';
  RAISE NOTICE 'Tables in public schema:';
END $$;

SELECT 'TABLE: ' || tablename as existing_items
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

DO $$ 
BEGIN
  RAISE NOTICE 'Functions in public schema:';
END $$;

SELECT 'FUNCTION: ' || proname as existing_items
FROM pg_proc 
WHERE pronamespace = 'public'::regnamespace
ORDER BY proname;

DO $$ 
BEGIN
  RAISE NOTICE 'Storage buckets:';
END $$;

SELECT 'BUCKET: ' || name || ' (public: ' || public::text || ')' as existing_items
FROM storage.buckets
ORDER BY name;

-- Step 2: Drop ONLY OUR custom triggers (skip Supabase system triggers)
-- ============================================================================
DO $$ 
DECLARE
  trigger_record RECORD;
BEGIN
  -- Only drop triggers that we created, not Supabase system triggers
  FOR trigger_record IN 
    SELECT tgname 
    FROM pg_trigger 
    WHERE tgrelid = 'auth.users'::regclass 
      AND tgname NOT LIKE 'RI_ConstraintTrigger%' -- Skip foreign key triggers
      AND tgname NOT LIKE 'trigger_auto_%' -- Skip auto-generated triggers
      AND tgisinternal = false -- Skip internal triggers
  LOOP
    BEGIN
      EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trigger_record.tgname) || ' ON auth.users';
      RAISE NOTICE 'Dropped trigger: %', trigger_record.tgname;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Skipped trigger (system): %', trigger_record.tgname;
    END;
  END LOOP;
END $$;

-- Drop our specific custom trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Drop ALL tables in public schema
-- ============================================================================
DO $$ 
DECLARE
  table_record RECORD;
BEGIN
  -- Get all tables in public schema
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(table_record.tablename) || ' CASCADE';
    RAISE NOTICE 'Dropped table: public.%', table_record.tablename;
  END LOOP;
END $$;

-- Step 4: Drop ALL views in public schema
-- ============================================================================
DO $$ 
DECLARE
  view_record RECORD;
BEGIN
  FOR view_record IN 
    SELECT viewname 
    FROM pg_views 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(view_record.viewname) || ' CASCADE';
    RAISE NOTICE 'Dropped view: public.%', view_record.viewname;
  END LOOP;
END $$;

-- Step 5: Drop ALL functions in public schema
-- ============================================================================
DO $$ 
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT 
      proname,
      pg_get_function_identity_arguments(oid) as args
    FROM pg_proc 
    WHERE pronamespace = 'public'::regnamespace
  LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS public.' || quote_ident(func_record.proname) || '(' || func_record.args || ') CASCADE';
    RAISE NOTICE 'Dropped function: public.%(%)', func_record.proname, func_record.args;
  END LOOP;
END $$;

-- Step 6: Drop ALL storage policies
-- ============================================================================
DO $$ 
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE schemaname = 'storage' 
      AND tablename = 'objects'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON storage.objects';
    RAISE NOTICE 'Dropped storage policy: %', policy_record.policyname;
  END LOOP;
END $$;

-- Step 7: Delete ALL storage buckets
-- ============================================================================
-- Note: This uses DELETE instead of DROP because buckets are rows in a table
DELETE FROM storage.buckets WHERE id IN ('avatars', 'project-assets', 'files');

-- Delete any other custom buckets (safe, won't delete system buckets)
DO $$
DECLARE
  bucket_record RECORD;
BEGIN
  FOR bucket_record IN 
    SELECT id 
    FROM storage.buckets 
    WHERE id NOT IN ('avatars', 'project-assets', 'files')
      AND id NOT LIKE 'supabase%' -- Protect system buckets
  LOOP
    DELETE FROM storage.buckets WHERE id = bucket_record.id;
    RAISE NOTICE 'Deleted bucket: %', bucket_record.id;
  END LOOP;
END $$;

-- Step 8: Verification - Check everything is gone
-- ============================================================================
DO $$ 
DECLARE
  table_count integer;
  function_count integer;
  bucket_count integer;
BEGIN
  SELECT COUNT(*) INTO table_count FROM pg_tables WHERE schemaname = 'public';
  SELECT COUNT(*) INTO function_count FROM pg_proc WHERE pronamespace = 'public'::regnamespace;
  SELECT COUNT(*) INTO bucket_count FROM storage.buckets WHERE id IN ('avatars', 'project-assets', 'files');
  
  RAISE NOTICE '=== CLEANUP VERIFICATION ===';
  RAISE NOTICE 'Remaining tables in public: %', table_count;
  RAISE NOTICE 'Remaining functions in public: %', function_count;
  RAISE NOTICE 'Remaining NexusHub buckets: %', bucket_count;
  
  IF table_count = 0 AND function_count = 0 AND bucket_count = 0 THEN
    RAISE NOTICE '✅ SUCCESS: Database is completely clean!';
  ELSE
    RAISE WARNING '⚠️  Some items remain - check manually if needed';
  END IF;
END $$;

-- ============================================================================
-- CLEANUP COMPLETE
-- ============================================================================
-- Your database is now completely clean and ready for fresh migrations.
-- 
-- Next steps:
-- 1. Run: supabase/migrations/20260201000000_initial_schema.sql
-- 2. Run: supabase/migrations/20260201000001_storage_setup.sql
-- ============================================================================
