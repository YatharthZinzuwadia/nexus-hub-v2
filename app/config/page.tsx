"use client";

import { useRouter, usePathname } from "next/navigation";
import SystemConfig from "../components/screens/SystemConfig";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function SystemConfigPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <SystemConfig onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
