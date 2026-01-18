"use client";

import { useRouter } from "next/navigation";
import DesignSystemHub from "../components/screens/DesignSystemHub";

export default function DesignSystemPage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return <DesignSystemHub onNavigate={handleNavigate} />;
}
