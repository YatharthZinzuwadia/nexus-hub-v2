# NexusHub v2: 360° Systems Overview

## 1. Vision

NexusHub v2 is a "Developer Operating System" designed as a unified hub for managing projects, code, notes, and files with a premium, high-tech aesthetic.

## 2. File Systems & Storage (The Hub)

The file system is the core of this update. It supports a hierarchical structure with real-world persistence.

### Logic Flow:

1.  **Frontend**: User selects a file. `FilesManager` triggers the `uploadFile` mutation.
2.  **API Layer**: `lib/api/files.ts` splits the task:
    - **Binary**: Uploads to `storage.objects` in the `files` bucket.
    - **Metadata**: Inserts a record into `public.files` (name, type, size, storage_path).
3.  **Database Trigger**: PostgreSQL notices the new row and updates `public.storage_quotas` to reflect the usage increase.

## 3. Component Architecture

### The Glassmorphism System

Every UI component follows the **Terminal-Glass** design system:

- `CarbonFiber`: Background pattern overlays.
- `ParticleField`: Ambient motion.
- `backdrop-blur-xl`: Layer separation.

### Navigation Hook

```typescript
interface FilesManagerProps {
  onNavigate: (screen: string) => void;
}
```

This enables the seamless switching between the dashboard and the file manager without full page reloads.

## 4. Current State of Implementation

| Feature              | Status       | Technology                     |
| :------------------- | :----------- | :----------------------------- |
| **User Auth**        | Complete     | Supabase Auth + AuthProvider   |
| **File Management**  | **Complete** | React Query + Supabase Storage |
| **Project Tracking** | In Progress  | `projects` table defined       |
| **Notifications**    | Complete     | Sonner (`toast`)               |
| **System Theme**     | Complete     | CSS Variables + ThemeProvider  |

## 5. Deployment & Scalability

- **Next.js**: Optimized via Turbopack for development.
- **Vercel Analytics**: Instrumented in `layout.tsx`.
- **Zod**: Validation patterns ready for form-heavy implementations.

## 6. Maintenance & Growth

- **Orphan Cleanup**: A SQL function `cleanup_orphaned_storage_objects` is prepared to ensure storage remains clean if database records are deleted without storage removal (though the API now handles this).
- **Quota System**: Scalable up to TB levels using `BIGINT` for byte tracking.

---

_Report Generated: 2026-02-23_
