"use client";

import { useRouter, usePathname } from "next/navigation";
import PageTransition from "../components/effects/PageTransition";
import MainDashboard from "../components/screens/MainDashboard";
import DashboardShell from "../components/layout/DashboardShell";

const DashboardPage = ({}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <MainDashboard onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
};

export default DashboardPage;
