"use client";

import { useRouter } from "next/navigation";
import { MainDashboard } from "../components/screens/MainDashboard";

const DashboardPage = ({}) => {
  const router = useRouter();
  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };
  return <MainDashboard onNavigate={handleNavigate} />;
};

export default DashboardPage;
