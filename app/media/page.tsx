"use client";

import { useRouter, usePathname } from "next/navigation";
import MediaGallery from "../components/screens/MediaGallery";
import DashboardShell from "../components/layout/DashboardShell";
import PageTransition from "../components/effects/PageTransition";

const MediaPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };
  return (
    <DashboardShell>
      <PageTransition transitionKey={pathname}>
        <MediaGallery onNavigate={handleNavigate} />
      </PageTransition>
    </DashboardShell>
  );
};

export default MediaPage;
