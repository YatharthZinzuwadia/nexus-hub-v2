<!-- THIS IS THE MASTER DOCUMENTATION> DO NOT MAINTAIN OR MAKE ANY OTHER DOCUMENTATION IN THE WHOLE PROJECT -->

# NexusHub v2 | Developer Operating System

> Your unified developer workspace with AI-powered intelligence

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.1-61DAFB?style=flat-square&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- 🔐 **Production-Ready Authentication** - Supabase Auth with email/password
- 🎨 **Dark/Light Mode** - Smooth theme transitions with system preference detection
- 🎭 **Heavy Animations** - Framer Motion powered interactions
- 🛡️ **Route Protection** - Middleware-based authentication guards
- 📦 **State Management** - Zustand for auth and theme state
- 🎯 **Terminal Aesthetic** - Retro programmer-inspired design
- 🚀 **Fully Typed** - TypeScript throughout
- 📱 **Responsive** - Works on all devices

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

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📚 Documentation

- **[AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md)** - Complete Supabase setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture and data flow
- **[AUTH_COMPLETE.md](./AUTH_COMPLETE.md)** - Implementation summary and next steps
- **[CORE_DOMAIN.md](./CORE_DOMAIN.md)** - Domain model definitions
- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Full project documentation

## 🏗️ Tech Stack

### Core

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety
- **TailwindCSS v4** - Utility-first CSS

### Authentication & Database

- **Supabase** - Backend as a Service
  - Auth (email/password, social)
  - PostgreSQL database
  - Row Level Security (RLS)

### State Management

- **Zustand** - Lightweight state management
  - Auth state
  - Theme state

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
│   ├── login/               # Login page
│   ├── signup/              # Signup page
│   ├── dashboard/           # Protected dashboard
│   ├── profile/             # User profile
│   ├── projects/            # Projects page
│   ├── ai/                  # AI Studio
│   ├── media/               # Media gallery
│   ├── settings/            # Settings
│   ├── design/              # Design system
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

## 📱 Navigation Architecture

The application uses a **Mobile-First** responsive navigation strategy:

- **Desktop**: Persistent Sidebar with collapsible/expandable menu.
- **Mobile**: Collapsible "Drawer" style menu accessed via Hamburger button.
- **DashboardShell**: A unified layout wrapper (`app/components/layout/DashboardShell.tsx`) ensures consistent navigation state across all protected routes.
- **System Map**: The "Motherboard" visualization on the dashboard serves as a secondary, interactive visual navigation method.

## 🛣️ Routes

### Public

- `/` - Splash screen
- `/onboarding/*` - Onboarding flow

### Auth (redirect if authenticated)

- `/login` - Login page
- `/signup` - Signup page

### Protected (require authentication)

- `/dashboard` - Main dashboard
- `/profile` - User profile
- `/projects` - Project repository
- `/ai` - AI Studio
- `/media` - Media gallery
- `/settings` - Settings
- `/design` - Design system

## 🧪 Testing

### Test Auth Flow

1. Start dev server: `yarn dev`
2. Navigate to `/signup`
3. Create account
4. Verify in Supabase dashboard
5. Test login
6. Test session persistence (refresh page)
7. Test logout

### Test Route Protection

- Try accessing `/dashboard` while logged out → redirects to `/login`
- Try accessing `/login` while logged in → redirects to `/dashboard`

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

## 🐛 Troubleshooting

See [AUTH_SETUP_GUIDE.md](./AUTH_SETUP_GUIDE.md#troubleshooting) for common issues and solutions.

## 📝 License

MIT

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [Framer Motion](https://www.framer.com/motion/)

---

**Built with ❤️ by developers, for developers**
