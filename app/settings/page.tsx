"use client";

import { useRouter, usePathname } from "next/navigation";
import SettingsScreen from "../components/screens/SettingsScreen";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function SettingsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <SettingsScreen onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
