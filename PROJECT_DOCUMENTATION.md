# NexusHub v2 - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Design Philosophy](#design-philosophy)
4. [Project Structure](#project-structure)
5. [Core Components](#core-components)
6. [Data Flow](#data-flow)
7. [Routing & Navigation](#routing--navigation)
8. [Styling System](#styling-system)
9. [Animation System](#animation-system)
10. [Key Features](#key-features)
11. [Development Setup](#development-setup)

---

## Project Overview

**NexusHub v2** is a sophisticated, AI-powered portfolio dashboard designed with a **retro-programmer aesthetic**. It combines modern web technologies with a terminal-inspired visual language to create a unique developer experience. The project is built as a Next.js application that showcases various screens including onboarding flows, dashboard management, AI interaction, project portfolios, and more.

### Version Information

- **Version**: v2.1.0
- **Build**: 20251213
- **Framework**: Next.js 16.0.10
- **React**: 19.2.1

### Project Purpose

NexusHub v2 serves as:

- A **portfolio dashboard** for developers
- An **AI-powered interface** for code assistance
- A **design system showcase**
- A **media gallery** for sound effects
- A **project management** interface

---

## Architecture & Technology Stack

### Core Technologies

#### Frontend Framework

- **Next.js 16.0.10** with App Router
- **React 19.2.1** (latest)
- **TypeScript** for type safety

#### Animation & Motion

- **Framer Motion (motion)** v12.23.26
  - Page transitions
  - Component animations
  - Micro-interactions
  - Gesture handling

#### Styling

- **TailwindCSS v4** with PostCSS
- **Custom CSS** for advanced effects
- **IBM Plex Mono & IBM Plex Sans** fonts from Google Fonts

#### Icons

- **Lucide React** v0.562.0
  - Over 1000+ icons
  - Consistent stroke-based design
  - Customizable size and color

#### Analytics

- **Vercel Analytics** for production tracking

### Development Tools

- **ESLint** for code quality
- **TypeScript** for type checking
- **Yarn** as package manager

---

## Design Philosophy

### Visual Language

The project embraces a **"Retro Programmer Aesthetic"** characterized by:

1. **Terminal-Inspired Interface**

   - Monospace fonts (IBM Plex Mono)
   - Command-line style interactions
   - System-like logging and feedback

2. **Minimalist Color Palette**

   ```css
   Primary: Black (#000000)
   Secondary: Dark variations (#0A0A0A, #141414, #1A1A1A)
   Accent: Red (#DC2626, #EF4444)
   Text: Grays (#FFFFFF, #E5E5E5, #A3A3A3, #525252)
   Success: Green (#22C55E)
   Warning: Orange (#F59E0B)
   ```

3. **Glass Morphism & Depth**

   - Transparent backgrounds with blur
   - Layered components
   - Subtle shadows and glows

4. **Retro Computing Effects**
   - Scanlines overlay
   - CRT-like noise texture
   - Glitch animations
   - Grid patterns
   - Carbon fiber textures

### Design Principles

1. **Zero-BS Interface** - No bloat, pure functionality
2. **Developer-First** - Built for those who speak in code
3. **Responsive** - Works on all device sizes
4. **Performant** - Optimized animations and rendering
5. **Accessible** - Semantic HTML and ARIA standards

---

## Project Structure

```
nexus-hub-v2/
├── app/                          # Next.js App Router directory
│   ├── components/               # React components
│   │   ├── effects/             # Visual effects components
│   │   │   ├── ParticleField.tsx    # Animated particle system
│   │   │   ├── CarbonFiber.tsx      # Carbon fiber texture
│   │   │   └── PageTransition.tsx   # Page transition wrapper
│   │   └── screens/             # Full-page screen components
│   │       ├── SplashScreen.tsx         # Initial boot screen
│   │       ├── OnboardingWelcome.tsx    # Onboarding step 1
│   │       ├── OnboardingFeatures.tsx   # Onboarding step 2
│   │       ├── OnboardingCTA.tsx        # Onboarding step 3
│   │       ├── LoginScreen.tsx          # Authentication screen
│   │       ├── MainDashboard.tsx        # Main control center
│   │       ├── ProfileScreen.tsx        # User profile with editing
│   │       ├── ProjectsScreen.tsx       # Project repository
│   │       ├── AIStudio.tsx             # AI chat interface
│   │       ├── MediaGallery.tsx         # Sound effect library
│   │       ├── SettingsScreen.tsx       # System configuration
│   │       └── DesignSystemHub.tsx      # Design system docs
│   ├── onboarding/              # Onboarding flow routes
│   │   ├── welcome/
│   │   ├── features/
│   │   ├── cta/
│   │   └── layout.tsx           # Onboarding layout wrapper
│   ├── dashboard/               # Dashboard route
│   ├── login/                   # Login route
│   ├── profile/                 # Profile route
│   ├── projects/                # Projects route
│   ├── ai/                      # AI Studio route
│   ├── media/                   # Media gallery route
│   ├── settings/                # Settings route
│   ├── design/                  # Design system route
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page (splash screen)
├── public/                      # Static assets
├── .next/                       # Next.js build output
├── node_modules/                # Dependencies
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── README.md                    # Project readme
```

---

## Core Components

### 1. Effect Components

#### ParticleField (`components/effects/ParticleField.tsx`)

**Purpose**: Creates an animated particle system with interactive mouse tracking

**Features**:

- Configurable particle density
- Mouse interaction (particles attracted to cursor)
- Dynamic connections between nearby particles
- Optimized canvas rendering with requestAnimationFrame
- Responds to window resize

**Props**:

```typescript
interface ParticleFieldProps {
  density?: number; // Number of particles (default: 50)
  color?: string; // Particle color (default: #DC2626)
  interactive?: boolean; // Enable mouse interaction (default: true)
  connectionDistance?: number; // Max distance for connections (default: 150)
}
```

**Algorithm**:

1. Initialize particles with random positions and velocities
2. On each frame:
   - Update particle positions
   - Apply boundary collision
   - Calculate mouse attraction (if interactive)
   - Apply friction
   - Draw particles and connections

#### CarbonFiber (`components/effects/CarbonFiber.tsx`)

**Purpose**: Renders a realistic carbon fiber texture pattern

**Features**:

- SVG-based pattern for scalability
- Weave pattern with light/dark threads
- Radial gradient shine effect
- Configurable opacity

**Props**:

```typescript
interface CarbonFiberProps {
  className?: string; // Additional CSS classes
  opacity?: number; // Opacity level (default: 0.4)
}
```

#### PageTransition (`components/effects/PageTransition.tsx`)

**Purpose**: Provides smooth page transitions with motion effects

**Features**:

- Fade + scale animation
- Blur effect during transition
- Red scanning line sweep effect
- Framer Motion AnimatePresence

**Animation Details**:

- Duration: 500ms
- Easing: Custom cubic-bezier [0.4, 0.0, 0.2, 1]
- Entry: opacity 0→1, scale 0.95→1, blur 8px→0
- Exit: opacity 1→0, scale 1→1.03, blur 0→8px

### 2. Screen Components

#### SplashScreen (`components/screens/SplashScreen.tsx`)

**Purpose**: Initial boot sequence screen with progress indicator

**Key Features**:

- Animated logo with blob effect
- Boot message sequence (8 messages)
- Progress bar (0-100%)
- Glitch effect every 3 seconds
- System icon animations
- Particle field background

**Flow**:

1. Logo animates in (scale + rotation)
2. Boot messages appear sequentially (350ms intervals)
3. Progress bar fills (1.5% every 40ms)
4. On completion, navigates to onboarding

**Props**:

```typescript
interface SplashScreenProps {
  onComplete: () => void; // Callback when boot completes
}
```

#### OnboardingWelcome (`components/screens/OnboardingWelcome.tsx`)

**Purpose**: First onboarding step - introduces the developer portal

**Layout**: Two-column grid

- **Left Column**:

  - System status badge (pulsing red dot)
  - Main heading with glowing "Developer" text
  - Supporting copy
  - Tech stats (50+ components, 99.9% uptime, <12ms response)
  - CTA buttons (Begin Tour / Skip Intro)
  - Rotating code snippets

- **Right Column**:
  - Animated terminal window
  - Boot sequence simulation
  - Floating decorative icons
  - Glowing background effects

**Animation System**:

- Orchestrated variants for staggered animations
- 15+ different animation timings
- Breathing icons with rotation
- Text glow pulsing
- Button shimmer on hover

#### OnboardingFeatures (`components/screens/OnboardingFeatures.tsx`)

**Purpose**: Second onboarding step - showcases key features

**Features Grid** (4 cards):

1. Command-Line Aesthetics
2. AI-Powered Intelligence
3. Modular Architecture
4. Zero-BS Interface

**Each Feature Card**:

- Icon with breathing animation
- Title and description
- Tag label (RETRO, SMART, SCALABLE, CLEAN)
- Hover: lifting effect + progress bar

**Additional Elements**:

- Loading progress badge
- Code snippet showcase with glowing border
- Navigation buttons

#### OnboardingCTA (`components/screens/OnboardingCTA.tsx`)

**Purpose**: Final onboarding step - call to action

**Content**:

- "Your Journey Begins Here" heading
- Primary CTA: "Initialize Session"
- Social proof stats (10K+ GitHub stars, ∞ coffee cups, 24/7 shipping)
- Terminal-style quote footer
- Step progress indicator

**Animations**:

- Corner ambient glows
- Card hover effects
- Button shimmer

#### LoginScreen (`components/screens/LoginScreen.tsx`)

**Purpose**: User authentication interface

**Layout**: Two-column

- **Left**: Branding + system info
  - Logo and version
  - Access Terminal heading
  - Terminal box with connection status
- **Right**: Login form
  - Username field
  - Password field (with show/hide toggle)
  - Remember me checkbox
  - Forgot password link
  - Submit button
  - Alternative: "Sign in with SSH Key"

**Security Indicators**:

- Encrypted connection status
- SSH tunnel active indicator
- Military-grade encryption footer

#### MainDashboard (`components/screens/MainDashboard.tsx`)

**Purpose**: Central control center - motherboard-style module layout

**Header Components**:

- Search bar
- Notification bell (with pulsing red dot)
- User profile button

**Main Content**:

- **Welcome Section**: Time display + greeting
- **Quick Stats**: Uptime, Latency, Modules, Status
- **Motherboard Layout** (Desktop):
  - 6 modules positioned like motherboard components
  - Animated connection lines between modules
  - Data pulse animations along connections
  - Circuit pins decoration
  - Hover: glow effect + icon rotation
- **Mobile Grid**: Responsive 2-column grid for mobile devices

**Modules**:

1. Media Core (ImageIcon)
2. AI Processor (Sparkles) - processing status
3. Project Array (FolderGit2)
4. User Interface (User)
5. Design Engine (Cpu)
6. System Config (Settings) - idle status

**Interactive Features**:

- Mouse follower glow effect
- Hoverable module tooltips
- System log with real-time updates
- Circuit board SVG background

#### ProfileScreen (`components/screens/ProfileScreen.tsx`)

**Purpose**: User profile management with comprehensive editing

**Edit Mode Features**:

- Toggle between view/edit modes
- **Editable Fields**:
  - Name
  - Handle
  - Bio (textarea)
  - Email
  - Location
  - Role

**Stats System**:

- Dynamic stat management (add/remove/edit)
- Default stats: Projects, Commits, Stars, Followers
- Each stat shows label + value

**Skills Management**:

- Display tech stack as tags
- Add new skills via form
- Remove skills (X button in edit mode)
- Default: TypeScript, React, Node.js, Python, Rust, Go, Docker, K8s, AWS, PostgreSQL, Redis, GraphQL

**Activity Feed**:

- Recent actions with repo names and timestamps
- Editable in edit mode
- Add new activities
- Remove activities

**Static Elements**:

- Avatar placeholder
- Verification badge
- Social links (GitHub, LinkedIn, Twitter)

#### ProjectsScreen (`components/screens/ProjectsScreen.tsx`)

**Purpose**: Portfolio project repository

**Filter System**: All / Active / Archived

- Dynamically filters project display

**Project Data Structure**:

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  stars: number;
  forks: number;
  language: string;
  icon: LucideIcon;
  status: "active" | "archived" | "wip";
  gradient: string;
}
```

**Featured Projects** (6 total):

1. NexusHub Core - Main dashboard
2. Quantum Algorithms - Research project
3. NeuralForge - ML framework
4. Terminal UI Kit - Component library
5. DistCache - Distributed caching (archived)
6. Code Poetry Engine - Artistic visualization

**Project Card Features**:

- Gradient header with animated pattern
- Status badge (active/wip/archived)
- Icon with rotation on hover
- Tag pills
- GitHub stats (stars, forks)
- Action buttons (GitHub link, external link)
- Hover: lift effect + red glow

**Stats Bar**:

- Total projects
- Active count
- In progress count
- Total stars

#### AIStudio (`components/screens/AIStudio.tsx`)

**Purpose**: AI-powered chat interface for developer assistance

**Header**:

- AI_ONLINE status indicator (pulsing green dot)
- System metrics: CPU and Memory usage (animated bars)

**Capabilities Bar** (4 metrics):

1. Neural Processing: 47 Layers
2. Response Time: <200ms
3. Languages: 120+
4. Model Size: 175B

**Message System**:

```typescript
interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}
```

**Initial Messages**:

- System: "NexusAI v2.1.0 initialized..."
- Assistant: Welcome message

**Chat Features**:

- User messages: Red gradient background
- Assistant messages: Terminal glass with glow effect
- System messages: Centered with monospace font
- Typing indicator: Pulsing dots animation
- Message actions: Copy and Export buttons (on hover)

**Input Area**:

- Multi-line textarea
- Character counter (0/4000)
- Send button with shimmer effect
- Enter to send (Shift+Enter for new line)

**Background Effects**:

- Animated neural network SVG (20 floating nodes)
- Particle field with red color
- Carbon fiber texture on sides
- Grid pattern overlay

#### MediaGallery (`components/screens/MediaGallery.tsx`)

**Purpose**: Sound effect library management

**View Modes**: Grid / List toggle

**Stats Bar**:

- Total sounds
- Categories
- Storage (12.4MB)
- Format (WAV)

**Sound Effects** (8 samples):

1. System Boot (2.3s)
2. Error Alert (1.1s)
3. Success Chime (0.8s)
4. Notification (1.5s)
5. Click (0.3s)
6. Whoosh (1.2s)
7. Data Transfer (3.4s)
8. Scanning (2.7s)

**Grid View**:

- Cards with waveform visualization
- Category tag
- Duration display
- Play/Stop button (toggles between play icon and volume icon)
- Download button

**List View**:

- Table format with sortable columns
- Columns: Name, File, Category, Duration, Actions
- Alternating row colors
- Hover highlighting

#### SettingsScreen (`components/screens/SettingsScreen.tsx`)

**Purpose**: System configuration panel

**Settings Sections** (4 main groups):

1. **PREFERENCES**:

   - Color Theme (select: Terminal Black, Matrix Green, Cyber Blue)
   - Monospace Font (select: IBM Plex Mono, JetBrains Mono, Fira Code)
   - Font Size (select: 12px, 14px, 16px, 18px)

2. **NOTIFICATIONS**:

   - Email Notifications (toggle)
   - Push Notifications (toggle)
   - Sound Effects (toggle)

3. **SECURITY**:

   - Two-Factor Auth (toggle)
   - Session Timeout (select: 15min, 30min, 1hr, Never)
   - Login History (button)

4. **DEVELOPER**:
   - Auto Save (toggle)
   - Debug Mode (toggle)
   - API Key (button)

**Danger Zone** (red border):

- Reset All Settings
- Delete Account

**System Info Footer**:

- Version: v2.1.0
- Build: 20251119.1337
- Environment: Production

**Toggle Switch Design**:

- Background changes: gray → red
- White slider moves left/right
- Smooth transitions

#### DesignSystemHub (`components/screens/DesignSystemHub.tsx`)

**Purpose**: Documentation hub for the design system

**Stats Display** (4 metrics):

- 50+ Components
- 20+ Animations
- 100% Accessible
- MIT Licensed

**Documentation Cards** (8 categories):

1. Design Foundations - Colors, Typography, Spacing
2. Component Library - 50+ Reusable Components
3. Animation States - Transitions & Interactions
4. 3D Isometric Views - Multi-Perspective Gallery
5. User Flow Diagrams - Navigation Architecture
6. Micro-Interactions - Subtle Feedback Details
7. Responsive Design - Breakpoint System
8. Notification System - Alerts & Toasts

**Card Interaction**:

- Hover: Lifts up slightly
- "OPEN →" indicator appears
- Click navigates to category

---

## Data Flow

### Application State Management

The project uses **React's built-in state management** (useState, useEffect) without external state libraries.

#### State Flow Diagram

```
┌─────────────────┐
│  SplashScreen   │
│   (progress)    │
└────────┬────────┘
         │ onComplete
         ↓
┌──────────────────────┐
│ OnboardingWelcome    │
│  (code snippets)     │
└──────────┬───────────┘
           │ onNext/onSkip
           ↓
┌──────────────────────┐
│ OnboardingFeatures   │
│   (no state)         │
└──────────┬───────────┘
           │ onNext/onSkip
           ↓
┌──────────────────────┐
│  OnboardingCTA       │
│   (no state)         │
└──────────┬───────────┘
           │ onSignIn
           ↓
┌──────────────────────┐
│   LoginScreen        │
│ (username, password) │
└──────────┬───────────┘
           │ onLogin
           ↓
┌──────────────────────┐
│   MainDashboard      │
│ (hover, time, mouse) │
└──────────┬───────────┘
           │ onNavigate(screen)
           ↓
┌────────────────────────────────┐
│  Feature Screens               │
│  - Profile (edit mode, data)   │
│  - Projects (filter, hover)    │
│  - AI Studio (messages, input) │
│  - Media (viewMode, playing)   │
│  - Settings (toggles, selects) │
│  - Design System (no state)    │
└────────────────────────────────┘
```

### Navigation Flow

```
Route: /
├─ SplashScreen → /onboarding/welcome

Route: /onboarding/*
├─ /welcome → /onboarding/features
├─ /features → /onboarding/cta
└─ /cta → /login

Route: /login
└─ LoginScreen → /dashboard

Route: /dashboard
└─ MainDashboard
    ├─ onNavigate('media') → /media
    ├─ onNavigate('ai') → /ai
    ├─ onNavigate('projects') → /projects
    ├─ onNavigate('profile') → /profile
    ├─ onNavigate('design') → /design
    └─ onNavigate('settings') → /settings

All Feature Routes
└─ Back button → /dashboard
```

### Component Props Flow

Each screen follows a consistent pattern:

```typescript
interface ScreenProps {
  onNavigate?: (screen: string) => void; // Navigate to another screen
  onNext?: () => void; // Move to next step
  onSkip?: () => void; // Skip current flow
  onComplete?: () => void; // Complete current process
  onLogin?: () => void; // Authenticate user
  onSignIn?: () => void; // Alternative auth
}
```

---

## Routing & Navigation

### Next.js App Router Structure

The project uses **Next.js 16 App Router** with file-based routing:

```
app/
├── page.tsx                 → /              (SplashScreen)
├── layout.tsx              → Root layout
├── onboarding/
│   ├── layout.tsx          → Shared onboarding layout
│   ├── welcome/page.tsx    → /onboarding/welcome
│   ├── features/page.tsx   → /onboarding/features
│   └── cta/page.tsx        → /onboarding/cta
├── login/page.tsx          → /login
├── dashboard/page.tsx      → /dashboard
├── profile/page.tsx        → /profile
├── projects/page.tsx       → /projects
├── ai/page.tsx             → /ai
├── media/page.tsx          → /media
├── settings/page.tsx       → /settings
└── design/page.tsx         → /design
```

### Page Component Pattern

Each route follows this pattern:

```typescript
"use client"; // Mark as client component

import { useRouter, usePathname } from "next/navigation";
import PageTransition from "../components/effects/PageTransition";
import ScreenComponent from "../components/screens/ScreenComponent";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <PageTransition transitionKey={pathname}>
      <ScreenComponent onNavigate={handleNavigate} />
    </PageTransition>
  );
};

export default Page;
```

### Client-Side Navigation

All navigation is handled client-side using Next.js `useRouter`:

```typescript
import { useRouter } from "next/navigation";

const router = useRouter();

// Navigate to screen
router.push("/dashboard");

// Navigate with state (via URL params if needed)
router.push("/projects?filter=active");
```

---

## Styling System

### Global CSS Architecture

Located in `app/globals.css` (~304 lines)

#### CSS Variables (Design Tokens)

```css
:root {
  /* Colors - Monochrome with Red Accent */
  --terminal-black: #000000;
  --void-black: #0a0a0a;
  --carbon-black: #141414;
  --obsidian: #1a1a1a;
  --charcoal: #262626;

  --error-red: #dc2626;
  --highlight-red: #ef4444;
  --dark-red: #991b1b;
  --dim-red: #7f1d1d;

  --white: #ffffff;
  --ghost-white: #f5f5f5;
  --light-gray: #e5e5e5;
  --medium-gray: #a3a3a3;
  --dark-gray: #737373;
  --darker-gray: #525252;
  --slate: #404040;

  /* Semantic Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --info: #3b82f6;

  /* Shadows */
  --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.5);
  --elevation-2: 0 4px 6px rgba(0, 0, 0, 0.4);
  --elevation-3: 0 10px 25px rgba(0, 0, 0, 0.6);
  --glow-red: 0 0 20px rgba(220, 38, 38, 0.3);
  --glow-red-strong: 0 0 40px rgba(220, 38, 38, 0.5);
}
```

#### Utility Classes

**Gradients**:

```css
.gradient-primary {
  /* Black gradient */
}
.gradient-accent {
  /* Red gradient */
}
.gradient-text {
  /* Text gradient white */
}
.gradient-red-text {
  /* Text gradient red */
}
```

**Glass Effects**:

```css
.terminal-glass {
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(115, 115, 115, 0.2);
  box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
}

.terminal-glass-strong {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(40px);
  border: 1px solid rgba(115, 115, 115, 0.3);
}
```

**Glow Effects**:

```css
.glow-red {
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
}
.glow-red-strong {
  box-shadow: 0 0 40px rgba(220, 38, 38, 0.5);
}
.text-glow-red {
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
}
```

**Grid Pattern**:

```css
.grid-pattern {
  background-image: linear-gradient(
      rgba(115, 115, 115, 0.3) 1px,
      transparent 1px
    ), linear-gradient(90deg, rgba(115, 115, 115, 0.3) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

**CRT Effects**:

```css
body::before {
  /* Scanline overlay */
}
body::after {
  /* Noise texture */
}
.scan-effect::before {
  /* Scanning beam animation */
}
```

#### Scrollbar Styling

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--void-black);
}
::-webkit-scrollbar-thumb {
  background: var(--slate);
  border-radius: 0;
}
```

#### Selection Styling

```css
::selection {
  background: var(--error-red);
  color: var(--white);
}
```

### TailwindCSS Integration

TailwindCSS v4 is configured via `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Common Tailwind Patterns in Project**:

- `flex`, `grid` - Layout
- `space-x-*`, `gap-*` - Spacing
- `rounded-sm` - Border radius
- `transition-all`, `duration-*` - Transitions
- `hover:*`, `group-hover:*` - Interactive states
- `md:`, `sm:`, `lg:` - Responsive breakpoints

---

## Animation System

### Framer Motion (motion) Integration

All animations use **Framer Motion v12.23.26**.

#### Animation Patterns

**1. Orchestrated Page Entry**

```typescript
const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: easeOut,
      when: "before-children",
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};
```

**2. Staggered Children**

```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Each child delays by 0.1s
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
```

**3. Continuous Animations**

```typescript
<motion.div
  animate={{
    rotate: [0, 360],
    scale: [1, 1.1, 1],
  }}
  transition={{
    duration: 3,
    repeat: Infinity,
    ease: "linear",
  }}
/>
```

**4. Hover Interactions**

```typescript
<motion.button
  whileHover={{ scale: 1.05, y: -4 }}
  whileTap={{ scale: 0.95 }}
  transition={{ duration: 0.2 }}
/>
```

**5. Gesture Animations**

```typescript
<motion.div
  drag
  dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
  dragElastic={0.2}
/>
```

#### Animation Performance Optimizations

1. **will-change CSS property**:

   ```jsx
   <canvas style={{ willChange: "transform" }} />
   ```

2. **GPU-accelerated transforms**:

   - Use `transform` instead of `left/top`
   - Use `opacity` instead of `visibility`

3. **AnimatePresence for exit animations**:

   ```jsx
   <AnimatePresence mode="wait">
     <motion.div key={id} exit={{ opacity: 0 }} />
   </AnimatePresence>
   ```

4. **useMemo for expensive calculations**:
   ```typescript
   const particles = useMemo(() => generateParticles(density), [density]);
   ```

---

## Key Features

### 1. Responsive Design

**Breakpoint System**:

- Mobile: < 640px (sm)
- Tablet: 640-1024px (md)
- Desktop: > 1024px (lg)

**Responsive Patterns**:

```tsx
// Column collapse
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

// Hidden on mobile
<div className="hidden md:block">

// Font size scaling
<h1 className="text-4xl sm:text-5xl md:text-6xl">

// Spacing adjustment
<div className="px-4 md:px-8">
```

**MainDashboard Responsive Strategy**:

- Desktop: Motherboard layout with absolute positioning
- Mobile: 2-column grid with simplified cards
- Both share same module data

### 2. Particle System

**Implementation**: Canvas-based with requestAnimationFrame

**Algorithm**:

1. **Particle Update**:

   ```
   x += vx
   y += vy
   if (out of bounds) velocity *= -1
   ```

2. **Mouse Interaction**:

   ```
   if (distance < threshold):
     force = (threshold - distance) / threshold
     vx += (dx / distance) * force * 0.02
   ```

3. **Friction**:

   ```
   vx *= 0.99
   vy *= 0.99
   ```

4. **Connection Drawing**:
   ```
   for each pair of particles:
     if (distance < connectionDistance):
       opacity = (1 - distance / connectionDistance) * 0.15
       draw line
   ```

**Performance**:

- Squared distance calculations (avoid Math.sqrt)
- Early exit for distant particles
- Memoized initialization

### 3. AI Chat System

**State Management**:

```typescript
const [messages, setMessages] = useState<Message[]>([
  systemMessage,
  welcomeMessage,
]);
const [input, setInput] = useState("");
const [isTyping, setIsTyping] = useState(false);
```

**Message Flow**:

1. User types input
2. Press Enter or click Send
3. User message added to state
4. `isTyping` set to true
5. After 2s delay, AI response generated
6. Response added to messages
7. `isTyping` set to false
8. Auto-scroll to bottom

**Mock AI Responses** (6 variations):

- "Excellent question. Let me break that down..."
- "I've analyzed your request through 47 neural layers..."
- "Fascinating problem. Have you considered..."
- etc.

### 4. Profile Edit Mode

**Edit Toggle**:

```typescript
const [isEditing, setIsEditing] = useState(false);
```

**Conditional Rendering Pattern**:

```tsx
{
  isEditing ? (
    <input value={profile.name} onChange={handleChange} />
  ) : (
    <h2>{profile.name}</h2>
  );
}
```

**Data Management**:

- Profile data stored in `profile` state object
- Stats stored in `stats` array state
- Skills stored in `skills` array state
- Activities stored in `activities` array state

**CRUD Operations**:

- Add stat/skill/activity
- Remove stat/skill/activity
- Edit all fields inline

### 5. Project Filtering

**Filter State**:

```typescript
const [filter, setFilter] = useState<"all" | "active" | "archived">("all");
```

**Filter Logic**:

```typescript
const filteredProjects = projects.filter((p) =>
  filter === "all" ? true : p.status === filter
);
```

**Stats Update**:

- Automatically recalculates based on `projects` array
- Total projects
- Active count
- WIP count
- Total stars (reduce sum)

### 6. Sound Player

**State**:

```typescript
const [playing, setPlaying] = useState<string | null>(null);
```

**Play/Stop Logic**:

```typescript
const handlePlay = (id: string) => {
  setPlaying(playing === id ? null : id);
};
```

**Note**: Currently visual-only (no actual audio playback implemented)

### 7. View Mode Toggle

**State**:

```typescript
const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
```

**Conditional Layout**:

```tsx
{
  viewMode === "grid" ? (
    <div className="grid grid-cols-4 gap-4">{/* Card layout */}</div>
  ) : (
    <table>{/* Table layout */}</table>
  );
}
```

---

## Development Setup

### Prerequisites

- **Node.js**: v18 or higher
- **Yarn**: v1.22+ (or npm/pnpm)
- **Git**: For version control

### Installation

1. **Clone Repository**:

   ```bash
   git clone <repository-url>
   cd nexus-hub-v2
   ```

2. **Install Dependencies**:

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Run Development Server**:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open Browser**:
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
yarn build
yarn start
```

### Linting

```bash
yarn lint
```

### Project Commands

```json
{
  "dev": "next dev", // Start dev server
  "build": "next build", // Build for production
  "start": "next start", // Start production server
  "lint": "eslint" // Run linter
}
```

### Environment Variables

No environment variables are currently required. The project runs entirely client-side.

### Browser Support

- **Chrome**: ✅ Latest
- **Firefox**: ✅ Latest
- **Safari**: ✅ Latest
- **Edge**: ✅ Latest

**Required Features**:

- ES2017+
- CSS Grid
- CSS Flexbox
- Canvas API
- requestAnimationFrame
- backdrop-filter (for glass effects)

---

## Directory Deep Dive

### `/app/components/effects/`

**Purpose**: Reusable visual effects

- `ParticleField.tsx`: Background particle animation system
- `CarbonFiber.tsx`: Texture pattern components
- `PageTransition.tsx`: Route transition wrapper

### `/app/components/screens/`

**Purpose**: Full-page screen components

Each screen is a complete, self-contained page component that handles its own:

- Layout
- State management
- User interactions
- Navigation callbacks

**Naming Convention**: `<Feature>Screen.tsx`

### `/app/onboarding/`

**Purpose**: Multi-step onboarding flow

**Structure**:

```
onboarding/
├── layout.tsx          # Shared layout with PageTransition
├── welcome/page.tsx    # Step 1
├── features/page.tsx   # Step 2
└── cta/page.tsx        # Step 3
```

**Flow Control**: Each step has `onNext` and `onSkip` callbacks

---

## Code Patterns & Best Practices

### 1. Component Organization

```typescript
// Imports
import { useState } from "react";
import { motion } from "motion/react";
import { Icon } from "lucide-react";

// Interfaces
interface ComponentProps {
  // ...
}

// Constants
const variants = {
  /* ... */
};

// Component
const Component = ({ prop }: ComponentProps) => {
  // State
  const [state, setState] = useState();

  // Effects
  useEffect(() => {
    /* ... */
  }, []);

  // Handlers
  const handleAction = () => {
    /* ... */
  };

  // Render
  return <div>{/* JSX */}</div>;
};

export default Component;
```

### 2. Motion Variants Pattern

```typescript
// Define variants outside component
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Use in component
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.div variants={itemVariants} />
  <motion.div variants={itemVariants} />
</motion.div>;
```

### 3. Typography Consistency

**Always use monospace for system-like elements**:

```tsx
<span style={{ fontFamily: "IBM Plex Mono, monospace" }}>SYSTEM_TEXT</span>
```

### 4. Color Usage

**Primary Actions**: Red (#DC2626)
**Text Hierarchy**:

- Primary: #FFFFFF
- Secondary: #E5E5E5
- Tertiary: #A3A3A3
- Disabled: #525252

**Backgrounds**:

- Pure black: #000000
- Cards: #0A0A0A
- Inputs: #141414

### 5. Spacing Scale

- `space-x-1` / `gap-1`: 4px
- `space-x-2` / `gap-2`: 8px
- `space-x-3` / `gap-3`: 12px
- `space-x-4` / `gap-4`: 16px
- `space-x-6` / `gap-6`: 24px
- `space-x-8` / `gap-8`: 32px

---

## Performance Considerations

### 1. Canvas Optimization

**ParticleField.tsx**:

- Uses `requestAnimationFrame` for smooth 60fps
- Squared distance calculations (avoid `Math.sqrt`)
- Early exit for particle connections
- Memoized particle initialization
- Cleanup on unmount

### 2. Animation Performance

**Best Practices Used**:

- `will-change: transform` on canvas
- GPU-accelerated properties (transform, opacity)
- Reduced motion media query support (could be added)
- Debounced resize listeners

### 3. Bundle Size

**Dependencies Are Minimal**:

- No heavy UI libraries (MUI, Ant Design, etc.)
- Lucide React (tree-shakeable icons)
- Motion (optimized animation library)
- TailwindCSS (purges unused classes)

**Current bundle** (estimated):

- JS: ~400KB (gzipped)
- CSS: ~50KB (gzipped)

### 4. Code Splitting

Next.js automatically handles:

- Route-based code splitting
- Dynamic imports for heavy components
- Lazy loading of pages

---

## Future Enhancement Ideas

### Potential Features

1. **Backend Integration**:

   - Real authentication
   - Database for user profiles
   - Actual AI API integration (OpenAI, etc.)
   - Real-time collaboration

2. **Enhanced Media**:

   - Actual audio playback (Web Audio API)
   - Waveform visualization (Canvas or SVG)
   - Audio upload and management

3. **Project Management**:

   - GitHub API integration
   - Real-time stats
   - Commit history visualization
   - Code diff viewer

4. **Theme System**:

   - Color theme switcher (Matrix Green, Cyber Blue)
   - Dark/Light mode toggle
   - Custom color picker

5. **Accessibility**:

   - Reduced motion mode
   - High contrast mode
   - Screen reader improvements
   - Keyboard navigation enhancements

6. **Performance**:

   - Service Worker for offline support
   - Image optimization
   - Lazy loading for below-fold content
   - Web Workers for heavy computations

7. **Analytics**:
   - User behavior tracking
   - Performance monitoring
   - Error boundary logging

---

## Conclusion

**NexusHub v2** is a meticulously crafted, developer-focused portfolio dashboard that combines:

✅ **Modern Web Technologies** - Next.js 16, React 19, TypeScript  
✅ **Smooth Animations** - Framer Motion with orchestrated transitions  
✅ **Retro Aesthetics** - Terminal-inspired design with red accents  
✅ **Interactive Effects** - Particle systems, glass morphism, scanlines  
✅ **Comprehensive Features** - AI chat, project showcase, media library  
✅ **Responsive Design** - Works on all screen sizes  
✅ **Clean Code** - Well-organized, documented, and maintainable

The project demonstrates expert-level understanding of:

- React component architecture
- State management patterns
- Animation orchestration
- Canvas rendering optimization
- Responsive design strategies
- TypeScript type safety
- Next.js routing and SSR

This documentation should serve as a complete reference for understanding every aspect of the NexusHub v2 project.
