"use client";

import { useRouter, usePathname } from "next/navigation";
import AIStudio from "../components/screens/AIStudio";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function AIPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <AIStudio onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
