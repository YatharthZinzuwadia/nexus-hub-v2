"use client";

import { useRouter } from "next/navigation";
import { SettingsScreen } from "../components/screens/SettingsScreen";

export default function SettingsPage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return <SettingsScreen onNavigate={handleNavigate} />;
}
