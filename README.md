<!-- THIS IS THE MASTER DOCUMENTATION. DO NOT MAINTAIN OR MAKE ANY OTHER DOCUMENTATION IN THE WHOLE PROJECT -->

# NexusHub v2 | Developer Operating System

> Your unified developer workspace with AI-powered intelligence

URL : https://nexus-hub-rho.vercel.app/

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Full_Backend-3ECF8E?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔐 **Authentication** - Supabase Auth (email/password + OAuth ready)
- 🗄️ **Database** - PostgreSQL with full CRUD operations
- 📦 **File Storage** - Supabase Storage with CDN delivery
- ⚡ **Real-time** - Live updates via Supabase subscriptions (coming soon)
- 🎨 **Dark/Light Mode** - Smooth theme transitions with system preference
- 🎭 **Heavy Animations** - Framer Motion powered interactions
- 🛡️ **Route Protection** - Middleware-based auth guards
- 📦 **State Management** - Zustand for auth and theme
- 🎯 **Terminal Aesthetic** - Retro programmer-inspired design
- 🚀 **Fully Typed** - TypeScript throughout
- 📱 **Responsive** - Mobile-first design

## 🚀 Quick Start

### 1. Install Dependencies

```bash
yarn install
```

### 2. Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

### Core

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety
- **TailwindCSS v4** - Utility-first CSS

### Authentication & Database

- **Supabase** - Backend as a Service
  - **Auth ONLY** - Email/password authentication
  - **PostgreSQL** - Database configured but NOT used
  - **No RLS policies** - No data stored in Supabase
  - **No server actions** - Pure client-side auth

### State Management

- **Zustand** - Lightweight state management
  - Auth state (mirrors Supabase session)
  - Theme state (persisted to localStorage)

### Animations

- **Framer Motion** - Production-ready animations
  - Page transitions
  - Micro-interactions
  - Gesture handling

### UI/UX

- **Lucide React** - Icon library
- **Sonner** - Toast notifications
- **IBM Plex Mono & Sans** - Typography

## 📁 Project Structure

```
nexus-hub-v2/
├── app/                      # Next.js App Router
│   ├── login/               # Login page (Supabase auth)
│   ├── signup/              # Signup page (Supabase auth)
│   ├── dashboard/           # Protected dashboard
│   ├── files/               # File manager (UI only)
│   ├── copilot/             # AI assistant (UI only)
│   ├── projects/            # Projects hub (UI only)
│   ├── tasks/               # Task manager (UI only)
│   ├── analytics/           # Analytics dashboard (UI only)
│   ├── automation/          # Automation (placeholder)
│   ├── calendar/            # Calendar (placeholder)
│   ├── profile/             # User profile (UI only)
│   ├── config/              # System config (UI only)
│   ├── design/              # Design system
│   ├── onboarding/          # Onboarding flow
│   ├── layout.tsx           # Root layout with providers
│   └── globals.css          # Global styles + themes
├── lib/
│   ├── supabase/
│   │   ├── client.ts        # Browser Supabase client
│   │   └── server.ts        # Server Supabase client
│   ├── store/
│   │   ├── auth-store.ts    # Auth state (Zustand)
│   │   └── theme-store.ts   # Theme state (Zustand)
│   └── providers/
│       ├── auth-provider.tsx    # Auth sync provider
│       └── theme-provider.tsx   # Theme application
├── middleware.ts            # Route protection + session refresh
└── .env.local              # Environment variables
```

## 🔐 Authentication Flow

```
User signs up/logs in
    ↓
Supabase creates session
    ↓
Session stored in httpOnly cookies
    ↓
Middleware validates on every request
    ↓
AuthProvider syncs to Zustand
    ↓
Components access user state
```

**Files with Supabase Integration:**

- `app/login/page.tsx` - Login form (auth.signInWithPassword)
- `app/signup/page.tsx` - Signup form (auth.signUp)
- `app/components/layout/DashboardShell.tsx` - Logout button (auth.signOut)
- `app/components/screens/MainDashboard.tsx` - Logout button (auth.signOut)
- `lib/providers/auth-provider.tsx` - Session sync (auth.onAuthStateChange)

## 🎨 Theme System

- **Dark Mode** (default) - Terminal black with red accents
- **Light Mode** - Clean white with vibrant red accents
- **System Mode** - Follows OS preference
- **Smooth Transitions** - 300ms ease transitions

Toggle theme:

```typescript
import { useThemeStore } from "@/lib/store/theme-store";

const { theme, setTheme } = useThemeStore();
setTheme("light"); // or 'dark' or 'system'
```

## 🛣️ Routes (18 Total)

### Public

- `/` - Splash screen
- `/onboarding/*` - Onboarding flow (welcome, features, cta)

### Auth (redirect if authenticated)

- `/login` - Login page
- `/signup` - Signup page

### Protected (require authentication)

- `/dashboard` - Main dashboard with motherboard visualization
- `/files` - File manager (UI only, no upload)
- `/copilot` - AI assistant (UI only, no real AI)
- `/projects` - Projects hub (UI only, no data)
- `/tasks` - Task manager with Kanban board (UI only, no persistence)
- `/analytics` - Analytics dashboard (UI only, mock data)
- `/automation` - Automation hub (placeholder)
- `/calendar` - Calendar (placeholder)
- `/profile` - User profile (UI only)
- `/config` - System configuration (UI only)
- `/design` - Design system showcase

## 📊 Backend Status Report

### ✅ IMPLEMENTED (Supabase Auth Only)

- **Authentication**: Email/password signup, login, logout
- **Session Management**: Cookie-based sessions with middleware validation
- **User State**: Synced to Zustand for UI reactivity

### ❌ NOT IMPLEMENTED (Pure Frontend)

All modules are **UI-only** with **mock/hardcoded data**:

| Module     | Status      | Data Source                      |
| ---------- | ----------- | -------------------------------- |
| Files      | UI only     | Hardcoded file list in component |
| Co-Pilot   | UI only     | Mock AI responses                |
| Projects   | UI only     | Hardcoded project cards          |
| Tasks      | UI only     | Hardcoded tasks/notes in state   |
| Analytics  | UI only     | Mock metrics and charts          |
| Automation | Placeholder | Coming soon                      |
| Calendar   | Placeholder | Coming soon                      |
| Profile    | UI only     | No user data stored              |
| Config     | UI only     | Settings not persisted           |

### 🗄️ Database Usage

- **Supabase PostgreSQL**: Configured but **NOT USED**
- **No tables created**
- **No RLS policies**
- **No server actions**
- **No API routes**
- **No data persistence** (except auth sessions in cookies)

### 🔌 Backend Architecture

- **100% Client-Side** (except auth)
- **No server components** fetching data
- **No database queries** outside auth
- **No file uploads** to storage
- **No real-time subscriptions**

## 📦 Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Other Platforms

Ensure Node.js 18+ and set environment variables.

## 🔮 Future Backend Integration

To add real backend functionality:

1. **Create Supabase Tables** for projects, tasks, files, etc.
2. **Add RLS Policies** for row-level security
3. **Replace Mock Data** with Supabase queries
4. **Add Server Actions** for mutations
5. **Enable Storage** for file uploads
6. **Add Real-Time** subscriptions for live updates

## 📝 License

MIT

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Framer Motion](https://www.framer.com/motion/)

---

**Built with ❤️ by developers, for developers**
