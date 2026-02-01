# NexusHub v2 - Backend Implementation TODO

## 🎯 **GOAL**: Convert from UI-only to production-grade full-stack application

### ⚙️ **Technology Stack Decision**

- ✅ **APPROVED**: Supabase (PostgreSQL + Storage + Realtime + Edge Functions)
- ❌ **REJECTED**: MongoDB (reasons documented in implementation notes)

---

## 📊 **PHASE 1: Database Schema & Storage Setup**

### 1.1 Database Schema Design

- [ ] Design `profiles` table (extends auth.users)
- [ ] Design `projects` table (portfolio items)
- [ ] Design `tasks` table (Kanban board)
- [ ] Design `notes` table (task notes/comments)
- [ ] Design `files` table (file metadata)
- [ ] Design `analytics_events` table (user activity tracking)
- [ ] Design `copilot_conversations` table (AI chat history)
- [ ] Design `copilot_messages` table (individual messages)
- [ ] Create SQL migration file
- [ ] Apply schema to Supabase

### 1.2 Row Level Security (RLS) Policies

- [ ] `profiles` RLS: Users can read own profile, update own profile
- [ ] `projects` RLS: Users can CRUD own projects
- [ ] `tasks` RLS: Users can CRUD own tasks
- [ ] `notes` RLS: Users can CRUD notes on own tasks
- [ ] `files` RLS: Users can CRUD own files
- [ ] `analytics_events` RLS: Users can insert/read own events
- [ ] `copilot_conversations` RLS: Users can CRUD own conversations
- [ ] `copilot_messages` RLS: Users can CRUD messages in own conversations
- [ ] Test RLS policies with different user contexts

### 1.3 Storage Buckets

- [ ] Create `avatars` bucket (public, image optimization)
- [ ] Create `project-assets` bucket (private, large files)
- [ ] Create `files` bucket (private, general file uploads)
- [ ] Configure storage policies for each bucket
- [ ] Set up image transformations for avatars

---

## 📦 **PHASE 2: Core Module Implementation**

### 2.1 Profile Module (`/profile`)

**Current**: UI-only with hardcoded data  
**Target**: Full CRUD with database persistence

- [ ] Create `lib/api/profile.ts` with:
  - `getProfile(userId: string)`
  - `updateProfile(userId: string, data: ProfileUpdate)`
  - `uploadAvatar(userId: string, file: File)`
- [ ] Update `ProfileScreen.tsx`:
  - Fetch profile data on mount
  - Save edits to database
  - Upload avatar to Supabase Storage
  - Handle loading/error states
  - Optimistic UI updates
- [ ] Add TypeScript types for profile data
- [ ] Add form validation (Zod schema)
- [ ] Test profile CRUD operations

### 2.2 Projects Module (`/projects`)

**Current**: Hardcoded 6 projects  
**Target**: Dynamic portfolio with CRUD

- [ ] Create `lib/api/projects.ts` with:
  - `getProjects(userId: string, filter?: ProjectFilter)`
  - `createProject(data: ProjectCreate)`
  - `updateProject(id: string, data: ProjectUpdate)`
  - `deleteProject(id: string)`
  - `uploadProjectAsset(projectId: string, file: File)`
- [ ] Update `ProjectsScreen.tsx`:
  - Fetch projects from database
  - Add "New Project" form modal
  - Add edit/delete functionality
  - Filter by status (active/archived/wip)
  - Upload project images/assets
- [ ] Create API route `/api/projects` for server actions
- [ ] Add TypeScript types and Zod validation
- [ ] Test project CRUD with multiple users

### 2.3 Tasks Module (`/tasks`)

**Current**: Hardcoded tasks, no persistence  
**Target**: Full Kanban with drag-drop persistence

- [ ] Create `lib/api/tasks.ts` with:
  - `getTasks(userId: string)`
  - `createTask(data: TaskCreate)`
  - `updateTask(id: string, data: TaskUpdate)`
  - `deleteTask(id: string)`
  - `reorderTasks(updates: TaskReorder[])`
- [ ] Create `lib/api/notes.ts` with:
  - `getNotes(taskId: string)`
  - `createNote(taskId: string, content: string)`
  - `deleteNote(id: string)`
- [ ] Update `TasksScreen.tsx`:
  - Fetch tasks from database
  - Persist drag-drop reordering
  - Save notes to database
  - Real-time updates (Supabase subscriptions)
- [ ] Add optimistic updates for drag operations
- [ ] Test concurrent edits from multiple users

### 2.4 Files Module (`/files`)

**Current**: Hardcoded file list  
**Target**: Real file upload/download/management

- [ ] Create `lib/api/files.ts` with:
  - `getFiles(userId: string, folderId?: string)`
  - `uploadFile(file: File, metadata: FileMetadata)`
  - `downloadFile(fileId: string)`
  - `deleteFile(fileId: string)`
  - `createFolder(name: string, parentId?: string)`
- [ ] Update `FilesScreen.tsx`:
  - Fetch files from database
  - Upload files with progress bar
  - Download files via signed URLs
  - Folder navigation
  - Search and filter files
  - File preview for images/pdfs
- [ ] Implement chunked uploads for large files (>5MB)
- [ ] Add file type validation and virus scanning
- [ ] Test with various file sizes (1KB - 100MB)

### 2.5 Co-Pilot Module (`/copilot`)

**Current**: Mock AI responses  
**Target**: Real AI with conversation history

- [ ] Create `lib/api/copilot.ts` with:
  - `getConversations(userId: string)`
  - `createConversation(title: string)`
  - `getMessages(conversationId: string)`
  - `sendMessage(conversationId: string, content: string)`
- [ ] Create Edge Function `supabase/functions/copilot-ai`:
  - Integrate with OpenAI API (GPT-4 or GPT-3.5-turbo)
  - OR use Anthropic Claude API
  - OR use Google Gemini API (FREE tier available)
  - Stream responses for better UX
- [ ] Update `AIStudio.tsx`:
  - Load conversation history
  - Send messages to AI Edge Function
  - Stream AI responses with typing indicator
  - Save all messages to database
  - Support code syntax highlighting
- [ ] Add conversation management (new/rename/delete)
- [ ] Add message retry and edit functionality
- [ ] Test with long conversations (>100 messages)

### 2.6 Analytics Module (`/analytics`)

**Current**: Mock metrics  
**Target**: Real activity tracking and visualization

- [ ] Create `lib/api/analytics.ts` with:
  - `trackEvent(event: AnalyticsEvent)`
  - `getMetrics(userId: string, range: DateRange)`
  - `getActivityLog(userId: string, limit: number)`
- [ ] Create database triggers for auto-tracking:
  - Project created/updated
  - Task completed
  - File uploaded
  - Login events
- [ ] Update `AnalyticsScreen.tsx`:
  - Fetch real metrics from database
  - Calculate trends (vs last period)
  - Render activity timeline
  - Add date range picker
- [ ] Add chart library integration (recharts or chart.js)
- [ ] Test analytics with simulated data

---

## 📦 **PHASE 3: Advanced Features**

### 3.1 Real-time Collaboration

- [ ] Add Supabase Realtime subscriptions to:
  - Tasks (live Kanban updates)
  - Co-Pilot (see typing indicators)
  - Projects (live status updates)
- [ ] Show "User X is editing" indicators
- [ ] Handle conflict resolution (last-write-wins or CRDT)

### 3.2 Search Functionality

- [ ] Implement PostgreSQL full-text search:
  - Projects
  - Tasks
  - Files
  - Notes
- [ ] Create `search` API endpoint
- [ ] Add global search bar in dashboard
- [ ] Add search filters and sorting

### 3.3 Automation Module (`/automation`)

**Current**: Placeholder  
**Target**: Workflow automation

- [ ] Design automations schema:
  - Trigger types (time-based, event-based)
  - Action types (email, webhook, status change)
- [ ] Create automation engine using Supabase cron jobs
- [ ] Build UI for creating automations
- [ ] Add automation logs and monitoring

### 3.4 Calendar Module (`/calendar`)

**Current**: Placeholder  
**Target**: Task calendar view

- [ ] Add `due_date` field to tasks table
- [ ] Integrate calendar library (FullCalendar or react-big-calendar)
- [ ] Fetch tasks with due dates
- [ ] Allow drag-drop to change due dates
- [ ] Add calendar event creation

---

## 🔌 **PHASE 4: External Integrations**

### 4.1 GitHub Integration (OAuth)

- [ ] Set up GitHub OAuth app
- [ ] Add GitHub provider to Supabase Auth
- [ ] Fetch user's GitHub repos
- [ ] Display repos in Projects module
- [ ] Sync GitHub issues to Tasks
- [ ] Add GitHub activity to Analytics

### 4.2 Google Integration (OAuth)

- [ ] Set up Google OAuth (Drive + Calendar)
- [ ] Add Google provider to Supabase Auth
- [ ] Import Google Drive files to Files module
- [ ] Sync Google Calendar events
- [ ] Export NexusHub calendar to Google Calendar

### 4.3 Slack Integration (Incoming Webhooks - FREE)

- [ ] Create Slack app with incoming webhooks
- [ ] Add webhook URL to user settings
- [ ] Send notifications to Slack:
  - Task completed
  - Project deployed
  - AI query completed
- [ ] Add Slack notification preferences

---

## 🚀 **PHASE 5: Performance & Production**

### 5.1 Caching Strategy

- [ ] Implement React Query for client-side caching
- [ ] Add HTTP caching headers for static data
- [ ] Use Supabase connection pooling (pgbouncer)
- [ ] Add Redis for session caching (if needed)

### 5.2 Error Handling & Monitoring

- [ ] Add global error boundary
- [ ] Integrate Sentry for error tracking
- [ ] Add Supabase database logs monitoring
- [ ] Create health check endpoint `/api/health`
- [ ] Add rate limiting to API routes

### 5.3 Testing

- [ ] Unit tests for API functions (Vitest)
- [ ] Integration tests for database operations
- [ ] E2E tests for critical flows (Playwright)
- [ ] Load testing with k6 or Artillery
- [ ] Security testing (SQL injection, XSS, CSRF)

### 5.4 Deployment & CI/CD

- [ ] Set up GitHub Actions workflow:
  - Run tests on PR
  - Type checking
  - Linting
  - Build verification
- [ ] Add Supabase CLI for migrations
- [ ] Create staging environment
- [ ] Set up database backups
- [ ] Add deployment preview for PRs (Vercel)

---

## 📚 **PHASE 6: Documentation**

- [ ] Update README with:
  - Database schema diagrams
  - API documentation
  - Environment variables guide
  - Deployment guide
- [ ] Add JSDoc comments to all API functions
- [ ] Create ARCHITECTURE.md with system design
- [ ] Document integration setup guides

---

## 🎯 **Success Metrics**

| Metric                | Target  | Current | Status |
| --------------------- | ------- | ------- | ------ |
| Database Tables       | 8+      | 0       | ❌     |
| CRUD Modules          | 6+      | 0       | ❌     |
| File Upload           | Working | None    | ❌     |
| Real-time Features    | 2+      | 0       | ❌     |
| External Integrations | 2+      | 0       | ❌     |
| Test Coverage         | >70%    | 0%      | ❌     |
| API Response Time     | <200ms  | N/A     | ❌     |
| Lighthouse Score      | >90     | TBD     | ❌     |

---

## 📝 **Notes**

- **Database Choice**: Supabase approved based on:
  - Already integrated
  - Superior file storage with CDN
  - Better cold start performance
  - Native Vercel integration
  - Free tier includes 1GB file storage
- **MongoDB Rejected** due to:
  - GridFS performance issues for file serving
  - No built-in CDN
  - Requires manual Atlas setup
  - No advantage for this use case

- **All code will include**:
  - Detailed inline comments
  - TypeScript strict mode
  - Error handling
  - Loading states
  - Optimistic updates where applicable

---

**Last Updated**: 2026-02-01  
**Status**: Ready to begin implementation  
**Current Phase**: Phase 1 - Database Schema & Storage Setup
