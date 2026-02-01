/**
 * DATABASE TYPES - Auto-generated TypeScript types matching Supabase schema
 *
 * This file contains all TypeScript types for database tables.
 * These types ensure type-safety throughout the application when
 * interacting with Supabase database.
 *
 * IMPORTANT: When schema changes, run `supabase gen types typescript`
 * to regenerate these types automatically.
 */

// ============================================================================
// ENUMS
// ============================================================================

export type Theme = "dark" | "light" | "system";
export type ColorScheme = "terminal-black" | "matrix-green" | "cyber-blue";
export type ProjectStatus = "active" | "archived" | "wip" | "completed";
export type ProjectVisibility = "public" | "private" | "unlisted";
export type TaskStatus = "todo" | "in-progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type FileType = "file" | "folder";
export type MessageRole = "user" | "assistant" | "system";
export type CopilotModel =
  | "gpt-4"
  | "gpt-3.5-turbo"
  | "claude-3"
  | "gemini-pro";

export type AnalyticsEventType =
  | "login"
  | "logout"
  | "project_created"
  | "project_updated"
  | "project_deleted"
  | "task_created"
  | "task_completed"
  | "file_uploaded"
  | "file_downloaded"
  | "copilot_message_sent"
  | "profile_updated"
  | "integration_connected"
  | "search_performed";

export type ResourceType =
  | "project"
  | "task"
  | "file"
  | "note"
  | "conversation"
  | "message";

export type TriggerType = "time-based" | "event-based" | "webhook";
export type ActionType = "email" | "webhook" | "status-change" | "notification";

// ============================================================================
// DATABASE ROW TYPES (as returned from database)
// ============================================================================

/**
 * Profile - User profile information
 * Extends auth.users with additional fields
 */
export interface Profile {
  id: string; // UUID matching auth.users.id
  name: string;
  handle: string | null;
  bio: string;
  role: string;
  location: string;
  avatar_url: string | null;

  // Contact & Social
  email: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  website_url: string | null;

  // Preferences
  theme: Theme;
  color_scheme: ColorScheme;
  font_family: string;
  font_size: number;

  // Notification Settings
  email_notifications: boolean;
  push_notifications: boolean;
  sound_effects: boolean;

  // Security Settings
  two_factor_enabled: boolean;
  session_timeout: number; // minutes
  auto_save: boolean;
  debug_mode: boolean;
  api_key: string | null;
  skills: string[]; // Tech stack/skills

  // Integration Tokens
  github_access_token: string | null;
  google_access_token: string | null;
  slack_webhook_url: string | null;

  // Metadata
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

/**
 * Project - Portfolio project
 */
export interface Project {
  id: string; // UUID
  user_id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  gradient: string; // Tailwind gradient classes

  // Project Details
  readme: string | null;
  demo_url: string | null;
  github_url: string | null;
  npm_url: string | null;

  // Status
  status: ProjectStatus;
  visibility: ProjectVisibility;
  featured: boolean;

  // Tech Stack (stored as JSON)
  tags: string[]; // e.g., ["TypeScript", "React"]
  tech_stack: any[]; // Flexible JSON array

  // GitHub Stats
  stars: number;
  forks: number;
  watchers: number;
  issues: number;
  language: string | null;

  // Metrics
  total_commits: number;
  last_commit_at: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * Task - Kanban board task
 */
export interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  position: number; // Order within status column
  tags: string[]; // e.g., ["bug", "urgent"]
  assigned_to: string | null;

  // Scheduling
  due_date: string | null;
  start_date: string | null;
  completed_at: string | null;

  // Metadata
  created_at: string;
  updated_at: string;
}

/**
 * Note - Comment/note on a task
 */
export interface Note {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

/**
 * File - File or folder metadata
 * Actual file data is stored in Supabase Storage
 */
export interface File {
  id: string;
  user_id: string;
  parent_folder_id: string | null;
  project_id: string | null;
  name: string;
  type: FileType;
  mime_type: string | null;

  // Storage
  storage_path: string | null;
  storage_bucket: string;
  size_bytes: number;
  extension: string | null;
  is_public: boolean;

  // Metadata
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * CopilotConversation - AI chat conversation thread
 */
export interface CopilotConversation {
  id: string;
  user_id: string;
  title: string;
  model: CopilotModel;
  temperature: number;
  max_tokens: number;
  is_archived: boolean;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * CopilotMessage - Individual message in a conversation
 */
export interface CopilotMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;

  // Token tracking for cost estimation
  prompt_tokens: number | null;
  completion_tokens: number | null;
  total_tokens: number | null;

  created_at: string;
}

/**
 * AnalyticsEvent - User activity tracking event
 */
export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: AnalyticsEventType;
  metadata: Record<string, any>; // Flexible JSON
  resource_type: ResourceType | null;
  resource_id: string | null;

  // Session info
  ip_address: string | null;
  user_agent: string | null;

  created_at: string;
}

/**
 * Automation - Workflow automation rule
 */
export interface Automation {
  id: string;
  user_id: string;
  name: string;
  description: string;
  trigger_type: TriggerType;
  trigger_config: Record<string, any>;
  action_type: ActionType;
  action_config: Record<string, any>;
  is_active: boolean;
  last_run_at: string | null;
  next_run_at: string | null;
  run_count: number;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// INSERT TYPES (for creating new records)
// ============================================================================

/**
 * Data required to create a new profile
 * (Usually handled by trigger on auth.users insert)
 */
export type ProfileInsert = Omit<
  Partial<Profile>,
  "id" | "created_at" | "updated_at"
> & {
  id: string; // Required: must match auth.users.id
};

/**
 * Data required to create a new project
 */
export type ProjectInsert = Omit<
  Project,
  | "id"
  | "created_at"
  | "updated_at"
  | "stars"
  | "forks"
  | "watchers"
  | "issues"
  | "total_commits"
> & {
  user_id: string; // Required
  title: string; // Required
};

/**
 * Data required to create a new task
 */
export type TaskInsert = Omit<
  Task,
  "id" | "created_at" | "updated_at" | "completed_at"
> & {
  user_id: string; // Required
  title: string; // Required
};

/**
 * Data required to create a new note
 */
export type NoteInsert = Omit<Note, "id" | "created_at" | "updated_at"> & {
  task_id: string; // Required
  user_id: string; // Required
  content: string; // Required
};

/**
 * Data required to upload a new file
 */
export type FileInsert = Omit<
  File,
  "id" | "uploaded_at" | "created_at" | "updated_at"
> & {
  user_id: string; // Required
  name: string; // Required
  type: FileType; // Required
};

/**
 * Data required to create a new conversation
 */
export type CopilotConversationInsert = Omit<
  CopilotConversation,
  "id" | "created_at" | "updated_at" | "last_message_at"
> & {
  user_id: string; // Required
};

/**
 * Data required to create a new message
 */
export type CopilotMessageInsert = Omit<CopilotMessage, "id" | "created_at"> & {
  conversation_id: string; // Required
  role: MessageRole; // Required
  content: string; // Required
};

/**
 * Data required to track an analytics event
 */
export type AnalyticsEventInsert = Omit<AnalyticsEvent, "id" | "created_at"> & {
  user_id: string; // Required
  event_type: AnalyticsEventType; // Required
};

/**
 * Data required to create an automation
 */
export type AutomationInsert = Omit<
  Automation,
  "id" | "created_at" | "updated_at" | "last_run_at" | "run_count"
> & {
  user_id: string; // Required
  name: string; // Required
  trigger_type: TriggerType; // Required
  action_type: ActionType; // Required
};

// ============================================================================
// UPDATE TYPES (for updating existing records)
// ============================================================================

/**
 * Data allowed when updating a profile
 */
export type ProfileUpdate = Partial<
  Omit<Profile, "id" | "created_at" | "updated_at">
>;

/**
 * Data allowed when updating a project
 */
export type ProjectUpdate = Partial<
  Omit<Project, "id" | "user_id" | "created_at" | "updated_at">
>;

/**
 * Data allowed when updating a task
 */
export type TaskUpdate = Partial<
  Omit<Task, "id" | "user_id" | "created_at" | "updated_at">
>;

/**
 * Data allowed when updating a file
 */
export type FileUpdate = Partial<
  Omit<File, "id" | "user_id" | "uploaded_at" | "created_at" | "updated_at">
>;

/**
 * Data allowed when updating a conversation
 */
export type CopilotConversationUpdate = Partial<
  Omit<
    CopilotConversation,
    "id" | "user_id" | "created_at" | "updated_at" | "last_message_at"
  >
>;

/**
 * Data allowed when updating an automation
 */
export type AutomationUpdate = Partial<
  Omit<Automation, "id" | "user_id" | "created_at" | "updated_at" | "run_count">
>;

// ============================================================================
// EXTENDED TYPES (with joins)
// ============================================================================

/**
 * Task with associated notes
 */
export interface TaskWithNotes extends Task {
  notes: Note[];
}

/**
 * Project with file count
 */
export interface ProjectWithStats extends Project {
  file_count?: number;
  task_count?: number;
  completed_task_count?: number;
}

/**
 * Conversation with message count
 */
export interface ConversationWithStats extends CopilotConversation {
  message_count?: number;
  total_tokens_used?: number;
}

/**
 * Profile with aggregated stats (from profile_stats view)
 */
export interface ProfileWithStats extends Profile {
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  total_files: number;
  total_stars: number;
}

// ============================================================================
// FILTER TYPES (for query parameters)
// ============================================================================

/**
 * Project filter options
 */
export interface ProjectFilter {
  status?: ProjectStatus;
  visibility?: ProjectVisibility;
  featured?: boolean;
  language?: string;
  search?: string; // Full-text search on title/description
}

/**
 * Task filter options
 */
export interface TaskFilter {
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string;
  has_due_date?: boolean;
  overdue?: boolean;
  search?: string;
}

/**
 * File filter options
 */
export interface FileFilter {
  type?: FileType;
  parent_folder_id?: string | null;
  project_id?: string | null;
  mime_type?: string;
  search?: string;
}

/**
 * Analytics date range filter
 */
export interface DateRange {
  start: string; // ISO date
  end: string; // ISO date
}

/**
 * Analytics metrics aggregation
 */
export interface AnalyticsMetrics {
  total_events: number;
  total_projects: number;
  total_tasks: number;
  completed_tasks: number;
  total_files: number;
  total_storage_bytes: number;
  active_conversations: number;
  total_messages: number;
  login_count: number;
  last_login: string | null;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Standard API success response
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ============================================================================
// STORAGE TYPES
// ============================================================================

/**
 * File upload metadata
 */
export interface FileUploadMetadata {
  name: string;
  mime_type: string;
  size_bytes: number;
  parent_folder_id?: string | null;
  project_id?: string | null;
  is_public?: boolean;
}

/**
 * File download signed URL response
 */
export interface FileDownloadUrl {
  url: string;
  expires_at: string;
}

// ============================================================================
// COPILOT TYPES
// ============================================================================

/**
 * Copilot message with streaming
 */
export interface StreamingMessage {
  id: string;
  role: MessageRole;
  content: string;
  is_streaming: boolean;
  created_at: string;
}

/**
 * Copilot request payload
 */
export interface CopilotRequest {
  conversation_id: string;
  message: string;
  model?: CopilotModel;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Copilot response payload
 */
export interface CopilotResponse {
  message: CopilotMessage;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for checking if response is an error
 */
export function isApiError(
  response: ApiResponse | ApiError,
): response is ApiError {
  return response.success === false;
}

/**
 * Type guard for checking if a file is a folder
 */
export function isFolder(file: File): boolean {
  return file.type === "folder";
}

/**
 * Type guard for checking if a task is overdue
 */
export function isTaskOverdue(task: Task): boolean {
  if (!task.due_date || task.status === "done") return false;
  return new Date(task.due_date) < new Date();
}
