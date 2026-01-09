"use client";

import { useRouter } from "next/navigation";
import ProjectsScreen from "../components/screens/ProjectsScreen";

const ProjectsPage = () => {
  const router = useRouter();
  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };
  return <ProjectsScreen onNavigate={handleNavigate} />;
};

export default ProjectsPage;
