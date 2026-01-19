"use client";

import { useRouter, usePathname } from "next/navigation";
import DesignSystemHub from "../components/screens/DesignSystemHub";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function DesignSystemPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <DesignSystemHub onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
