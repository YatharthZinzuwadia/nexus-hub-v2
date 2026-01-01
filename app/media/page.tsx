"use client";

import { useRouter } from "next/navigation";
import MediaGallery from "../components/screens/MediaGallery";

const MediaPage = () => {
  const router = useRouter();
  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };
  return <MediaGallery onNavigate={handleNavigate} />;
};

export default MediaPage;
