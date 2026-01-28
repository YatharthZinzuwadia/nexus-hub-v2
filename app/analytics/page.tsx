"use client";

import { useRouter, usePathname } from "next/navigation";
import Analytics from "../components/screens/Analytics";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function AnalyticsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <Analytics onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
