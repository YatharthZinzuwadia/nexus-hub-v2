# NexusHub: The Ultimate Master Guide

## Complete Strategy, Architecture & Implementation Guide with Supabase

> **Your definitive resource for building a production-grade, addictive developer productivity OS from scratch.**

---

## 📖 Table of Contents

1. [Vision & Strategy](#vision--strategy)
2. [Architecture Overview](#architecture-overview)
3. [Supabase Setup & Integration](#supabase-setup--integration)
4. [Core Modules Implementation](#core-modules-implementation)
5. [Animation System Guide](#animation-system-guide)
6. [Real-Time Features](#real-time-features)
7. [AI Integration](#ai-integration)
8. [Engagement & Gamification](#engagement--gamification)
9. [Testing & Quality](#testing--quality)
10. [Deployment & Performance](#deployment--performance)
11. [Portfolio Presentation](#portfolio-presentation)

---

## Vision & Strategy

### Mission Statement

Create a productivity platform so satisfying that developers **crave** opening it. Transform NexusHub from a beautiful demo into a career-defining, production-grade system that demonstrates full-stack mastery.

### Core Positioning

**NexusHub** is a modular, multi-tenant, AI-powered productivity OS for developers—real-time, secure, beautifully animated, and engineered to scale with addictive engagement mechanics.

### Recruiter Narrative

"NexusHub tackles the chaos of scattered developer tools by fusing tasks, notes, calendar, files, integrations, and automations into a seamless workspace. Live collaboration sparks instant synergy, AI assistants anticipate needs, gamified streaks reward consistency, and mesmerizing animations turn mundane actions into delightful micro-moments."

### Design Philosophy

NexusHub's modules are not "pages"—they are **interconnected control systems** designed to pull users into continuous flow. Every interaction must:

1. **Solve a real problem**
2. **React immediately to the user**
3. **Visually communicate system state**

---

## Architecture Overview

### Module Boundaries (Modular Monolith)

```
┌──────────────────────────────────────────────────────────┐
│                  NEXUSHUB CORE ENGINE                     │
├────────────┬─────────────┬─────────────┬────────────────┤
│   AUTH &   │  WORKSPACE  │    TASKS    │     NOTES      │
│  IDENTITY  │   MANAGER   │   ENGINE    │  COLLABORATION │
├────────────┼─────────────┼─────────────┼────────────────┤
│  CALENDAR  │INTEGRATIONS │ AUTOMATIONS │   AI STUDIO    │
│    SYNC    │     HUB     │   ENGINE    │    COPILOT     │
├────────────┼─────────────┼─────────────┼────────────────┤
│   FILES    │  ANALYTICS  │NOTIFICATIONS│   PRESENCE     │
│  STORAGE   │   INSIGHTS  │   CENTER    │    SYSTEM      │
└────────────┴─────────────┴─────────────┴────────────────┘
```

### Technology Stack

**Frontend**

- Next.js 16 (App Router) - Edge + ISR
- React 19 + TypeScript (strict mode)
- Framer Motion 12 - Animations
- TailwindCSS v4 - Styling
- IBM Plex Mono/Sans - Typography

**Backend & Database**

- **Supabase** (PostgreSQL + Auth + Realtime + Storage)
- Prisma ORM - Type-safe queries
- Redis (Upstash) - Caching & sessions
- Server Actions - Mutations
- tRPC or REST - API layer

**Real-Time & Jobs**

- Supabase Realtime - Presence & subscriptions
- BullMQ - Job queues
- WebSockets/SSE - Live updates

**AI & ML**

- Provider-agnostic layer (OpenAI, Anthropic)
- Vercel AI SDK - Streaming responses
- Prompt versioning - Track & optimize

**DevOps**

- Vercel - Hosting & edge functions
- GitHub Actions - CI/CD
- OpenTelemetry - Observability
- Playwright - E2E testing

---

## Supabase Setup & Integration

### Why Supabase?

- **All-in-one**: Auth, database, storage, real-time in one platform
- **PostgreSQL**: Production-grade relational DB
- **Row Level Security**: Built-in authorization
- **Real-time subscriptions**: Perfect for collaboration
- **Generous free tier**: Great for learning
- **Edge functions**: Serverless compute

### Step 1: Project Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase in your project
supabase init

# Start local development
supabase start

# This starts:
# - PostgreSQL on localhost:54322
# - Studio on http://localhost:54323
# - API on http://localhost:54321
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set strong database password (save it!)
5. Wait for project provisioning (~2 mins)

### Step 3: Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/ssr
npm install -D supabase
```

### Step 4: Environment Variables

Create `.env.local`:

```.env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI (optional for now)
OPENAI_API_KEY=sk-...

# Redis (Upstash)
REDIS_URL=redis://...
REDIS_TOKEN=...
```

### Step 5: Create Supabase Client

Create `lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}
```

### Step 6: Database Schema

Create `supabase/migrations/20260109_initial_schema.sql`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces (multi-tenancy)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace members (RBAC)
CREATE TYPE member_role AS ENUM ('owner', 'admin', 'editor', 'viewer');

CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role member_role NOT NULL DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#DC2626',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done', 'archived');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  position INTEGER NOT NULL DEFAULT 0,
  labels TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notes (rich content)
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events (calendar)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  recurring_rule JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation rules
CREATE TABLE automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_config JSONB NOT NULL,
  actions_config JSONB NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  run_count INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES auth.users(id),
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_notes_workspace ON notes(workspace_id);
CREATE INDEX idx_events_workspace_time ON events(workspace_id, start_time);
CREATE INDEX idx_audit_logs_workspace ON audit_logs(workspace_id);

-- Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access workspaces they're members of
CREATE POLICY "Users see their workspaces"
  ON workspaces FOR SELECT
  USING (
    id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users see workspace tasks"
  ON tasks FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- Add similar policies for other tables...

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

Apply migration:

```bash
# Local
supabase db push

# Production
supabase db push --linked
```

---

## Core Modules Implementation

### Module 1: Auth & Workspace System

#### Implementation Steps

**1. Create Auth Context (`lib/auth/context.tsx`)**

```typescript
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type AuthContext = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContext>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**2. OAuth Sign-In with Animation**

```typescript
"use client";

import { useState } from "motion/react";
import { createClient } from "@/lib/supabase/client";
import { Github } from "lucide-react";

export function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const signInWithGitHub = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-screen"
    >
      <div className="terminal-glass p-8 rounded-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 gradient-text">
          // Initialize NexusHub
        </h1>

        <button
          onClick={signInWithGitHub}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Github size={20} />
          {loading ? "Connecting..." : "Sign in with GitHub"}
        </button>
      </div>
    </motion.div>
  );
}
```

**3. Auth Callback Handler (`app/auth/callback/route.ts`)**

```typescript
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
```

**4. Workspace Creation**

```typescript
// app/actions/workspace.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert({
      name,
      slug,
      owner_id: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Add owner as workspace member
  await supabase.from("workspace_members").insert({
    workspace_id: workspace.id,
    user_id: user.id,
    role: "owner",
  });

  revalidatePath("/dashboard");
  return workspace;
}
```

---

### Module 2: Tasks & Projects - The Dopamine Factory

#### Core Features

- Kanban + list hybrid views
- Real-time optimistic updates
- Drag & drop with physics simulation
- Streak tracking & gamification
- Variable reward system

#### Implementation

**1. Task Schema with Prisma**

```typescript
// prisma/schema.prisma
model Task {
  id          String   @id @default(uuid())
  projectId   String
  workspaceId String
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  assigneeId  String?
  dueDate     DateTime?
  completedAt DateTime?
  position    Int      @default(0)
  labels      String[]

  project     Project  @relation(fields: [projectId], references: [id])
  workspace   Workspace @relation(fields: [workspaceId], references: [id])
  assignee    User?    @relation(fields: [assigneeId], references: [id])

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
  ARCHIVED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}
```

**2. Task Creation with Server Action**

```typescript
// app/actions/tasks.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createTask(data: {
  title: string;
  projectId: string;
  workspaceId: string;
  priority?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: task, error } = await supabase
    .from("tasks")
    .insert({
      ...data,
      created_by: user.id,
      status: "todo",
    })
    .select()
    .single();

  if (error) throw error;

  // Emit domain event for automation engine
  await emitEvent("task.created", { taskId: task.id, userId: user.id });

  revalidatePath("/dashboard");
  return task;
}

export async function completeTask(taskId: string) {
  const supabase = await createClient();

  const { data: task, error } = await supabase
    .from("tasks")
    .update({
      status: "done",
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) throw error;

  await emitEvent("task.completed", { taskId, completedAt: new Date() });

  revalidatePath("/dashboard");
  return task;
}
```

**3. Task Card with Completion Animation**

```typescript
"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import { completeTask } from "@/app/actions/tasks";

const PARTICLE_COUNT = 12;

export function TaskCard({ task }) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    setShowParticles(true);

    // Optimistic update
    await completeTask(task.id);

    setTimeout(() => setShowParticles(false), 600);
  };

  return (
    <motion.div
      layout
      className="relative terminal-glass p-4 rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isCompleting ? 0.6 : 1,
        scale: isCompleting ? 0.98 : 1,
      }}
    >
      {/* Particle burst */}
      <AnimatePresence>
        {showParticles && (
          <>
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
              const angle = (i * 360) / PARTICLE_COUNT;
              const x = Math.cos((angle * Math.PI) / 180) * 50;
              const y = Math.sin((angle * Math.PI) / 180) * 50;

              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full"
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x,
                    y,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Task content */}
      <div className="flex items-start gap-3">
        <button
          onClick={handleComplete}
          className="flex-shrink-0 w-6 h-6 rounded border-2 border-gray-600 hover:border-red-500 transition-colors flex items-center justify-center"
        >
          <AnimatePresence>
            {isCompleting && (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={16} className="text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1">
          <h3
            className={`font-mono ${
              isCompleting ? "line-through opacity-60" : ""
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
```

**4. Streak Tracking System**

```typescript
// lib/gamification/streaks.ts
export async function updateStreak(userId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("streak_count, last_task_date")
    .eq("user_id", userId)
    .single();

  const today = new Date().toDateString();
  const lastDate = new Date(profile.last_task_date).toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let streakCount = profile.streak_count;

  if (lastDate === today) {
    // Already counted today
    return streakCount;
  } else if (lastDate === yesterday) {
    // Continue streak
    streakCount += 1;
  } else {
    // Reset streak
    streakCount = 1;
  }

  await supabase
    .from("user_profiles")
    .update({
      streak_count: streakCount,
      last_task_date: new Date(),
    })
    .eq("user_id", userId);

  // Check for achievements
  if (streakCount === 7) {
    await unlockAchievement(userId, "week_warrior");
  } else if (streakCount === 30) {
    await unlockAchievement(userId, "monthly_maestro");
  }

  return streakCount;
}

export function getStreakEmoji(streak: number) {
  if (streak >= 30) return "💎";
  if (streak >= 14) return "🔥🔥🔥";
  if (streak >= 7) return "🔥🔥";
  if (streak >= 3) return "🔥";
  return "🔥";
}

export function getStreakMessage(streak: number) {
  if (streak >= 30) return "LEGENDARY STREAK!";
  if (streak >= 14) return "UNSTOPPABLE";
  if (streak >= 7) return "On fire!";
  if (streak >= 3) return "Getting warm!";
  return "Keep going!";
}
```

---

### Module 3: Real-Time Collaboration

#### Supabase Realtime Setup

**1. Enable Realtime on Tables**

In Supabase Dashboard:

- Go to Database → Replication
- Enable realtime for: `tasks`, `notes`, `workspace_members`

**2. Real-Time Cursors**

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "motion/react";

type Cursor = {
  userId: string;
  x: number;
  y: number;
  username: string;
  color: string;
};

export function CollaborativeCursors({ workspaceId }: { workspaceId: string }) {
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(`workspace:${workspaceId}`);

    // Subscribe to presence
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const newCursors = new Map();

        Object.entries(state).forEach(([key, presence]) => {
          const [user] = presence as any;
          if (user) {
            newCursors.set(key, user);
          }
        });

        setCursors(newCursors);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track my cursor
          await channel.track({
            userId: "current-user-id",
            username: "You",
            color: "#DC2626",
            x: 0,
            y: 0,
          });
        }
      });

    // Update cursor position
    const handleMouseMove = async (e: MouseEvent) => {
      await channel.track({
        userId: "current-user-id",
        username: "You",
        color: "#DC2626",
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [workspaceId]);

  return (
    <>
      {Array.from(cursors.values()).map((cursor) => (
        <motion.div
          key={cursor.userId}
          className="fixed pointer-events-none z-50"
          animate={{
            x: cursor.x,
            y: cursor.y,
          }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 400,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5.65376 12.3673L8.97824 15.6918L11.6824 9.01263"
              stroke={cursor.color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div
            className="px-2 py-1 rounded text-xs font-mono mt-1"
            style={{
              backgroundColor: cursor.color,
              color: "white",
            }}
          >
            {cursor.username}
          </div>
        </motion.div>
      ))}
    </>
  );
}
```

**3. Realtime Task Updates**

```typescript
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useRealtimeTasks(workspaceId: string) {
  const [tasks, setTasks] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch
    const fetchTasks = async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("position");

      if (data) setTasks(data);
    };

    fetchTasks();

    // Subscribe to changes
    const channel = supabase
      .channel(`tasks:workspace:${workspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `workspace_id=eq.${workspaceId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setTasks((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((task) =>
                task.id === payload.new.id ? payload.new : task
              )
            );
          } else if (payload.eventType === "DELETE") {
            setTasks((prev) =>
              prev.filter((task) => task.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  return tasks;
}
```

---

### Module 4: AI Integration

#### Setup Vercel AI SDK

```bash
npm install ai @ai-sdk/openai
```

#### AI Summarizer Implementation

```typescript
// app/api/ai/summarize/route.ts
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { content } = await req.json();

  const result = streamText({
    model: openai("gpt-4-turbo"),
    prompt: `Summarize the following note into key action items and highlights:\n\n${content}`,
    temperature: 0.7,
    maxTokens: 500,
  });

  return result.toDataStreamResponse();
}
```

#### AI Task Planner

```typescript
// app/api/ai/plan-day/route.ts
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const DayPlanSchema = z.object({
  tasks: z.array(
    z.object({
      taskId: z.string(),
      suggestedTime: z.string(),
      duration: z.number(),
      reason: z.string(),
    })
  ),
});

export async function POST(req: Request) {
  const { tasks, workingHours } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4-turbo"),
    schema: DayPlanSchema,
    prompt: `
      Given these tasks: ${JSON.stringify(tasks)}
      And working hours: ${workingHours.start} to ${workingHours.end}
      
      Create an optimal daily plan that:
      1. Prioritizes high-priority and urgent tasks
      2. Groups similar tasks together
      3. Respects estimated durations
      4. Includes breaks
      5. Considers energy peaks (morning = deep work)
    `,
  });

  return Response.json(result.object);
}
```

#### Client-Side AI Hook

```typescript
"use client";

import { useChat } from "ai/react";

export function AIAssistant() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/ai/chat",
    });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, x: message.role === "user" ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-red-600 text-white"
                  : "terminal-glass"
              }`}
            >
              {message.content}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex gap-1">
              <motion.div
                className="w-2 h-2 bg-gray-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-2 h-2 bg-gray-500 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span>Thinking...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask AI anything..."
          className="w-full bg-transparent border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
        />
      </form>
    </div>
  );
}
```

---

## Animation System Guide

### Motion Tokens & Reusable Patterns

```typescript
// lib/animation/tokens.ts
export const motionTokens = {
  ease: {
    snappy: [0.4, 0.0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    liquid: [0.65, 0, 0.35, 1],
    elastic: [0.25, 0.46, 0.45, 0.94],
  },

  duration: {
    instant: 0.1,
    fast: 0.2,
    base: 0.3,
    slow: 0.5,
    pageTransition: 0.4,
  },

  spring: {
    stiff: { stiffness: 400, damping: 30 },
    bouncy: { stiffness: 300, damping: 20 },
    gentle: { stiffness: 200, damping: 25 },
  },
};

// Variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export const staggerChildren = {
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};
```

### Performance Optimization

```typescript
// Only animate transform and opacity (GPU-accelerated)
const optimized = {
  whileHover: {
    transform: 'scale(1.05)', // ✅
    opacity: 0.8, // ✅
  },
}

const avoid = {
  whileHover: {
    width: '200px', // ❌ Triggers layout recalc
    backgroundColor: '#DC2626', // ❌ Paint operation
  },
}

// Use will-change sparingly
<motion.div
  style={{ willChange: 'transform' }}
  whileHover={{ scale: 1.1 }}
/>

// Reduce motion support
import { useReducedMotion } from 'motion/react'

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{
        scale: shouldReduceMotion ? 1 : [1, 1.2, 1],
      }}
    />
  )
}
```

---

## Testing & Quality

### Unit Testing with Vitest

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

```typescript
// __tests__/tasks.test.ts
import { describe, it, expect } from "vitest";
import { createTask, completeTask } from "@/app/actions/tasks";

describe("Task Actions", () => {
  it("creates a task with correct defaults", async () => {
    const task = await createTask({
      title: "Test task",
      projectId: "123",
      workspaceId: "456",
    });

    expect(task.status).toBe("todo");
    expect(task.title).toBe("Test task");
  });

  it("marks task as complete with timestamp", async () => {
    const completed = await completeTask("task-id");

    expect(completed.status).toBe("done");
    expect(completed.completed_at).toBeTruthy();
  });
});
```

### E2E Testing with Playwright

```bash
npm install -D @playwright/test
```

```typescript
// e2e/tasks.spec.ts
import { test, expect } from "@playwright/test";

test("complete task flow", async ({ page }) => {
  await page.goto("http://localhost:3000/dashboard");

  // Create task
  await page.click('[data-testid="new-task-button"]');
  await page.fill('[data-testid="task-title"]', "Buy groceries");
  await page.click('[data-testid="create-task"]');

  // Verify task appears
  await expect(page.locator("text=Buy groceries")).toBeVisible();

  // Complete task
  await page.click('[data-testid="task-checkbox"]');

  // Verify celebration animation
  await expect(page.locator('[data-testid="particles"]')).toBeVisible();
});
```

---

## Deployment & Performance

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY

# Deploy
vercel --prod
```

### Performance Checklist

- [ ] Bundle size < 100KB initial JS
- [ ] Lighthouse score > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Image optimization with Next/Image
- [ ] Dynamic imports for heavy components
- [ ] Edge caching for API routes
- [ ] Database indexes on frequently queried fields

---

## Portfolio Presentation

### README Template

```markdown
# NexusHub: Developer Productivity OS

**Production-grade, multi-tenant workspace with real-time collaboration, AI assistance, and gamified engagement.**

## 🎯 Problem

Developers juggle 10+ tools daily. Context switching destroys flow state.

## 💡 Solution

NexusHub unifies tasks, notes, calendar, files, and automations into one seamless, real-time workspace.

## 🏗️ Architecture

- **Frontend**: Next.js 16, React 19, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Storage)
- **AI**: Vercel AI SDK with streaming responses
- **Caching**: Redis for sessions & hot queries
- **Deploy**: Vercel Edge Functions

## ⚡ Key Features

1. **Real-time collaboration** - Live cursors, presence, instant updates
2. **AI assistants** - Summarization & daily planning
3. **Automation engine** - If-this-then-that workflows
4. **Gamification** - Streaks, achievements, variable rewards
5. **Addictive UX** - Micro-animations, satisfying feedback

## 📊 Performance

- p95 latency: <200ms
- Bundle size: 94KB (gzipped)
- Lighthouse: 98/100
- Uptime: 99.9%

## 🎥 Demo

[Live Site](https://nexushub.vercel.app) | [Video Walkthrough](...)

## 📚 Lessons Learned

- Supabase RLS simplified multi-tenancy
- Framer Motion transforms enabled 60fps animations
- Variable rewards increased task completion by 40%

---

Built by [Your Name] | [Portfolio](...)
```

---

## What to Build Next

### High Priority

- ✅ Auth & Workspaces (Supabase)
- ✅ Tasks with realtime sync
- ✅ Animation system
- [ ] AI Summarizer endpoint
- [ ] Streak tracking system
- [ ] Automation builder UI
- [ ] Calendar with drag-drop

### Medium Priority

- [ ] File uploads (Supabase Storage)
- [ ] GitHub integration
- [ ] Advanced analytics dashboard
- [ ] Mobile responsive polish

### Future Enhancements

- [ ] Offline mode with IndexedDB
- [ ] Voice commands
- [ ] Team analytics
- [ ] API for third-party integrations

---

**You now have everything you need to build NexusHub from scratch. Start with auth, add tasks, then layer in real-time and AI. Make it addictive. Make it yours.**

🚀 **Now go build!**
