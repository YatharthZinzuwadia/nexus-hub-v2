"use client";

import { useRouter, usePathname } from "next/navigation";
import TaskManager from "../components/screens/TaskManager";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function TasksPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <TaskManager onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
