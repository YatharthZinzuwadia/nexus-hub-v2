"use client";

import { useRouter } from "next/navigation";
import { AIStudio } from "../components/screens/AIStudio";

export default function AIPage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return <AIStudio onNavigate={handleNavigate} />;
}
