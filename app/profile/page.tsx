"use client";

import { useRouter } from "next/navigation";
import ProfileScreen from "../components/screens/ProfileScreen";

export default function ProfilePage() {
  const router = useRouter();

  const handleNavigate = (screen: string) => {
    router.push(`/${screen}`);
  };

  return <ProfileScreen onNavigate={handleNavigate} />;
}
