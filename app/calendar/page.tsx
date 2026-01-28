"use client";

import { useRouter } from "next/navigation";
import DashboardShell from "../components/layout/DashboardShell";

export default function CalendarPage() {
  const router = useRouter();

  return (
    <DashboardShell>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1
            className="text-2xl text-foreground mb-4"
            style={{ fontFamily: "IBM Plex Mono, monospace" }}
          >
            CALENDAR_MODULE
          </h1>
          <p className="text-muted-foreground mb-4">Coming soon...</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-sm"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}
