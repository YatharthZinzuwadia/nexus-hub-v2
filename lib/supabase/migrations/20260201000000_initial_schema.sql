-- ============================================================================
-- NexusHub v2 - Initial Database Schema
-- ============================================================================
-- This migration creates all tables, indexes, RLS policies, and functions
-- for the complete NexusHub v2 application.
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE
-- ============================================================================
-- Extends auth.users with additional profile information
-- One-to-one relationship with auth.users

CREATE TABLE IF NOT EXISTS public.profiles (
  -- Primary key: matches auth.users.id
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Profile Information
  name TEXT NOT NULL DEFAULT '',
  handle TEXT UNIQUE, -- Username/handle (e.g., @username)
  bio TEXT DEFAULT '',
  role TEXT DEFAULT 'Developer',
  location TEXT DEFAULT '',
  avatar_url TEXT, -- URL to avatar in storage
  
  -- Contact & Social
  email TEXT, -- Synced from auth.users.email
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  
  -- User Preferences
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('dark', 'light', 'system')),
  color_scheme TEXT DEFAULT 'terminal-black' CHECK (color_scheme IN ('terminal-black', 'matrix-green', 'cyber-blue')),
  font_family TEXT DEFAULT 'IBM Plex Mono',
  font_size INTEGER DEFAULT 14 CHECK (font_size >= 12 AND font_size <= 24),
  
  -- Notification Settings
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sound_effects BOOLEAN DEFAULT true,
  
  -- Security Settings
  two_factor_enabled BOOLEAN DEFAULT false,
  session_timeout INTEGER DEFAULT 30, -- minutes
  
  -- Developer Settings
  auto_save BOOLEAN DEFAULT true,
  debug_mode BOOLEAN DEFAULT false,
  api_key TEXT, -- Encrypted API key for external integrations
  
  -- Integration Tokens (encrypted at application level)
  github_access_token TEXT,
  google_access_token TEXT,
  slack_webhook_url TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by handle
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON public.profiles(handle);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users';
COMMENT ON COLUMN public.profiles.handle IS 'Unique username/handle for display';
COMMENT ON COLUMN public.profiles.api_key IS 'User API key for programmatic access';

-- ============================================================================
-- 2. PROJECTS TABLE
-- ============================================================================
-- Stores user portfolio projects

CREATE TABLE IF NOT EXISTS public.projects (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Project Information
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT DEFAULT 'Folder', -- Lucide icon name
  gradient TEXT DEFAULT 'from-red-500/20 to-purple-500/20', -- Tailwind gradient
  
  -- Project Details
  readme TEXT, -- Markdown content
  demo_url TEXT,
  github_url TEXT,
  npm_url TEXT,
  
  -- Project Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'wip', 'completed')),
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  featured BOOLEAN DEFAULT false,
  
  -- Tech Stack (JSONB array of technology names)
  tags JSONB DEFAULT '[]'::JSONB, -- ["TypeScript", "React", "Node.js"]
  tech_stack JSONB DEFAULT '[]'::JSONB, -- More detailed tech info
  
  -- GitHub Stats (cached for performance)
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,
  issues INTEGER DEFAULT 0,
  language TEXT, -- Primary programming language
  
  -- Project Metrics
  total_commits INTEGER DEFAULT 0,
  last_commit_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search Optimization
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_projects_search_vector ON public.projects USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

COMMENT ON TABLE public.projects IS 'User portfolio projects';
COMMENT ON COLUMN public.projects.search_vector IS 'Full-text search vector for title and description';

-- ============================================================================
-- 3. TASKS TABLE
-- ============================================================================
-- Kanban board tasks with drag-drop ordering

CREATE TABLE IF NOT EXISTS public.tasks (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Optional project association
  
  -- Task Information
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  
  -- Kanban Status
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'review', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  -- Ordering (for drag-drop persistence)
  -- position = order within the status column (0, 1, 2, ...)
  position INTEGER NOT NULL DEFAULT 0,
  
  -- Task Details
  tags JSONB DEFAULT '[]'::JSONB, -- ["bug", "feature", "urgent"]
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- For team features
  
  -- Scheduling
  due_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_position ON public.tasks(user_id, status, position);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_search_vector ON public.tasks USING GIN(search_vector);

COMMENT ON TABLE public.tasks IS 'Kanban board tasks with ordering';
COMMENT ON COLUMN public.tasks.position IS 'Order within status column for drag-drop';

-- ============================================================================
-- 4. NOTES TABLE
-- ============================================================================
-- Comments/notes attached to tasks

CREATE TABLE IF NOT EXISTS public.notes (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Note Content
  content TEXT NOT NULL,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notes_task_id ON public.notes(task_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);

COMMENT ON TABLE public.notes IS 'Comments and notes attached to tasks';

-- ============================================================================
-- 5. FILES TABLE
-- ============================================================================
-- File metadata (actual files stored in Supabase Storage)

CREATE TABLE IF NOT EXISTS public.files (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES public.files(id) ON DELETE CASCADE, -- Self-referencing for folders
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL, -- Optional project association
  
  -- File Information
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'folder')),
  mime_type TEXT, -- e.g., 'image/png', 'application/pdf'
  
  -- Storage Information
  storage_path TEXT, -- Path in Supabase Storage bucket
  storage_bucket TEXT DEFAULT 'files', -- Bucket name
  size_bytes BIGINT DEFAULT 0, -- File size in bytes
  
  -- File Details
  extension TEXT, -- e.g., 'pdf', 'png', 'zip'
  is_public BOOLEAN DEFAULT false,
  
  -- Metadata
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(name, ''))
  ) STORED
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_files_user_id ON public.files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_parent_folder_id ON public.files(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_files_project_id ON public.files(project_id);
CREATE INDEX IF NOT EXISTS idx_files_type ON public.files(type);
CREATE INDEX IF NOT EXISTS idx_files_search_vector ON public.files USING GIN(search_vector);

COMMENT ON TABLE public.files IS 'File and folder metadata (files stored in Storage)';
COMMENT ON COLUMN public.files.storage_path IS 'Path to file in Supabase Storage';

-- ============================================================================
-- 6. COPILOT_CONVERSATIONS TABLE
-- ============================================================================
-- AI chat conversation threads

CREATE TABLE IF NOT EXISTS public.copilot_conversations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Conversation Information
  title TEXT NOT NULL DEFAULT 'New Conversation',
  
  -- Conversation Settings
  model TEXT DEFAULT 'gpt-4' CHECK (model IN ('gpt-4', 'gpt-3.5-turbo', 'claude-3', 'gemini-pro')),
  temperature DECIMAL(2,1) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 2000,
  
  -- Conversation State
  is_archived BOOLEAN DEFAULT false,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_copilot_conversations_user_id ON public.copilot_conversations(user_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_copilot_conversations_archived ON public.copilot_conversations(is_archived);

COMMENT ON TABLE public.copilot_conversations IS 'AI copilot conversation threads';

-- ============================================================================
-- 7. COPILOT_MESSAGES TABLE
-- ============================================================================
-- Individual messages in AI conversations

CREATE TABLE IF NOT EXISTS public.copilot_messages (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  conversation_id UUID NOT NULL REFERENCES public.copilot_conversations(id) ON DELETE CASCADE,
  
  -- Message Information
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  
  -- Token Usage (for cost tracking)
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  total_tokens INTEGER,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_copilot_messages_conversation_id ON public.copilot_messages(conversation_id, created_at ASC);

COMMENT ON TABLE public.copilot_messages IS 'Individual messages in AI conversations';
COMMENT ON COLUMN public.copilot_messages.total_tokens IS 'Total tokens used (for billing tracking)';

-- ============================================================================
-- 8. ANALYTICS_EVENTS TABLE
-- ============================================================================
-- User activity tracking for analytics dashboard

CREATE TABLE IF NOT EXISTS public.analytics_events (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Event Information
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login',
    'logout',
    'project_created',
    'project_updated',
    'project_deleted',
    'task_created',
    'task_completed',
    'file_uploaded',
    'file_downloaded',
    'copilot_message_sent',
    'profile_updated',
    'integration_connected',
    'search_performed'
  )),
  
  -- Event Details (JSONB for flexibility)
  metadata JSONB DEFAULT '{}'::JSONB,
  
  -- Resource Reference
  resource_type TEXT, -- 'project', 'task', 'file', etc.
  resource_id UUID,
  
  -- Session Information
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Partitioning hint: Consider partitioning by created_at for large datasets

COMMENT ON TABLE public.analytics_events IS 'User activity events for analytics';
COMMENT ON COLUMN public.analytics_events.metadata IS 'Flexible JSON field for event-specific data';

-- ============================================================================
-- 9. AUTOMATIONS TABLE (Future Feature)
-- ============================================================================
-- Workflow automation rules

CREATE TABLE IF NOT EXISTS public.automations (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relationships
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Automation Information
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  
  -- Trigger Configuration
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('time-based', 'event-based', 'webhook')),
  trigger_config JSONB NOT NULL DEFAULT '{}'::JSONB,
  
  -- Action Configuration
  action_type TEXT NOT NULL CHECK (action_type IN ('email', 'webhook', 'status-change', 'notification')),
  action_config JSONB NOT NULL DEFAULT '{}'::JSONB,
  
  -- Automation State
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE,
  run_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON public.automations(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_next_run ON public.automations(next_run_at) WHERE is_active = true;

COMMENT ON TABLE public.automations IS 'Workflow automation rules';

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.copilot_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.automations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function: Create profile on user signup
-- Safely handles missing metadata and avoids duplicate inserts
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert if profile doesn't already exist
  INSERT INTO public.profiles (id, email, name, handle)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1), 'User'),
    COALESCE(NEW.raw_user_meta_data->>'handle', split_part(NEW.email, '@', 1), NEW.id::text)
  )
  ON CONFLICT (id) DO NOTHING; -- Prevent duplicate insert errors
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail auth signup
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create profile when user signs up
-- Note: This will NOT run for existing users, only new signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill: Create profiles for existing users who don't have one
-- This is safe to run multiple times (uses ON CONFLICT DO NOTHING)
INSERT INTO public.profiles (id, email, name, handle)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1), 'User'),
  split_part(email, '@', 1) || '_' || substring(id::text, 1, 8) -- Ensure unique handle
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Update any NULL handles to ensure uniqueness
UPDATE public.profiles
SET handle = id::text
WHERE handle IS NULL;

-- Function: Update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.copilot_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update conversation timestamp on new message
CREATE TRIGGER on_new_copilot_message
  AFTER INSERT ON public.copilot_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- Function: Track analytics events automatically
CREATE OR REPLACE FUNCTION track_project_events()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.analytics_events (user_id, event_type, resource_type, resource_id, metadata)
    VALUES (NEW.user_id, 'project_created', 'project', NEW.id, jsonb_build_object('title', NEW.title));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.analytics_events (user_id, event_type, resource_type, resource_id, metadata)
    VALUES (NEW.user_id, 'project_updated', 'project', NEW.id, jsonb_build_object('title', NEW.title));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.analytics_events (user_id, event_type, resource_type, resource_id, metadata)
    VALUES (OLD.user_id, 'project_deleted', 'project', OLD.id, jsonb_build_object('title', OLD.title));
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Track project events
CREATE TRIGGER track_project_activity
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION track_project_events();

-- Function: Track task completion
CREATE OR REPLACE FUNCTION track_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'done' AND OLD.status != 'done' THEN
    UPDATE public.tasks SET completed_at = NOW() WHERE id = NEW.id;
    INSERT INTO public.analytics_events (user_id, event_type, resource_type, resource_id, metadata)
    VALUES (NEW.user_id, 'task_completed', 'task', NEW.id, jsonb_build_object('title', NEW.title));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Track task completion
CREATE TRIGGER on_task_completed
  AFTER UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION track_task_completion();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copilot_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

-- Users can view all profiles (for potential collaboration features)
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (handled by trigger, but allow explicit inserts)
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PROJECTS POLICIES
-- ============================================================================

-- Users can view their own projects and public projects
CREATE POLICY "Users can view own projects and public projects"
  ON public.projects FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR visibility = 'public');

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- TASKS POLICIES
-- ============================================================================

-- Users can view their own tasks
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own tasks
CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own tasks
CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own tasks
CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- NOTES POLICIES
-- ============================================================================

-- Users can view notes on their own tasks
CREATE POLICY "Users can view notes on own tasks"
  ON public.notes FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.tasks
    WHERE tasks.id = notes.task_id
    AND tasks.user_id = auth.uid()
  ));

-- Users can insert notes on their own tasks
CREATE POLICY "Users can insert notes on own tasks"
  ON public.notes FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.tasks
      WHERE tasks.id = notes.task_id
      AND tasks.user_id = auth.uid()
    )
  );

-- Users can delete their own notes
CREATE POLICY "Users can delete own notes"
  ON public.notes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- FILES POLICIES
-- ============================================================================

-- Users can view their own files and public files
CREATE POLICY "Users can view own files and public files"
  ON public.files FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR is_public = true);

-- Users can insert their own files
CREATE POLICY "Users can insert own files"
  ON public.files FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own files
CREATE POLICY "Users can update own files"
  ON public.files FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON public.files FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- COPILOT CONVERSATIONS POLICIES
-- ============================================================================

-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON public.copilot_conversations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own conversations
CREATE POLICY "Users can insert own conversations"
  ON public.copilot_conversations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
  ON public.copilot_conversations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own conversations
CREATE POLICY "Users can delete own conversations"
  ON public.copilot_conversations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- COPILOT MESSAGES POLICIES
-- ============================================================================

-- Users can view messages in their own conversations
CREATE POLICY "Users can view messages in own conversations"
  ON public.copilot_messages FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.copilot_conversations
    WHERE copilot_conversations.id = copilot_messages.conversation_id
    AND copilot_conversations.user_id = auth.uid()
  ));

-- Users can insert messages in their own conversations
CREATE POLICY "Users can insert messages in own conversations"
  ON public.copilot_messages FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.copilot_conversations
    WHERE copilot_conversations.id = copilot_messages.conversation_id
    AND copilot_conversations.user_id = auth.uid()
  ));

-- ============================================================================
-- ANALYTICS EVENTS POLICIES
-- ============================================================================

-- Users can view their own analytics events
CREATE POLICY "Users can view own analytics events"
  ON public.analytics_events FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own analytics events
CREATE POLICY "Users can insert own analytics events"
  ON public.analytics_events FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- AUTOMATIONS POLICIES
-- ============================================================================

-- Users can view their own automations
CREATE POLICY "Users can view own automations"
  ON public.automations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can insert their own automations
CREATE POLICY "Users can insert own automations"
  ON public.automations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own automations
CREATE POLICY "Users can update own automations"
  ON public.automations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own automations
CREATE POLICY "Users can delete own automations"
  ON public.automations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: User profile with stats
CREATE OR REPLACE VIEW public.profile_stats AS
SELECT
  p.id,
  p.name,
  p.handle,
  p.avatar_url,
  COUNT(DISTINCT pr.id) AS total_projects,
  COUNT(DISTINCT t.id) AS total_tasks,
  COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'done') AS completed_tasks,
  COUNT(DISTINCT f.id) AS total_files,
  COALESCE(SUM(pr.stars), 0) AS total_stars
FROM public.profiles p
LEFT JOIN public.projects pr ON pr.user_id = p.id
LEFT JOIN public.tasks t ON t.user_id = p.id
LEFT JOIN public.files f ON f.user_id = p.id AND f.type = 'file'
GROUP BY p.id, p.name, p.handle, p.avatar_url;

COMMENT ON VIEW public.profile_stats IS 'Profile with aggregated statistics';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
