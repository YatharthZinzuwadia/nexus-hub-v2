"use client";

import { useRouter, usePathname } from "next/navigation";
import ProjectsScreen from "../components/screens/ProjectsScreen";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

const ProjectsPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };
  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <ProjectsScreen onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
};

export default ProjectsPage;
