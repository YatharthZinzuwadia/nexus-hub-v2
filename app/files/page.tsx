"use client";

import { useRouter, usePathname } from "next/navigation";
import FilesManager from "../components/screens/FilesManager";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

const FilesPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };
  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <FilesManager onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
};

export default FilesPage;
