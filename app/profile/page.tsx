"use client";

import { useRouter, usePathname } from "next/navigation";
import ProfileScreen from "../components/screens/ProfileScreen";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

export default function ProfilePage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <ProfileScreen onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
}
