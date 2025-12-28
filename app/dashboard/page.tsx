"use client";

import { useRouter, usePathname } from "next/navigation";
import { MainDashboard } from "../components/screens/MainDashboard";
import PageTransition from "../components/effects/PageTransition";

const DashboardPage = ({}) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return (
    <PageTransition transitionKey={pathname}>
      <MainDashboard onNavigate={handleNavigate} />
    </PageTransition>
  );
};

export default DashboardPage;
