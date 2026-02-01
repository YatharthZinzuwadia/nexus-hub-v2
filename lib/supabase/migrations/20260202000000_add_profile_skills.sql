-- Add skills column to profiles table
-- This stores the user's tech stack as a JSON array

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::JSONB;

COMMENT ON COLUMN public.profiles.skills IS 'User tech stack/skills as JSON array';

-- Create index for querying skills
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN(skills);