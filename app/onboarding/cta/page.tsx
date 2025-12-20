"use client";

import OnboardingCTA from "@/app/components/screens/OnboardingCTA";
import { useRouter } from "next/navigation";

export default function OnboardingCTAPage() {
  const router = useRouter();

  return <OnboardingCTA onSignIn={() => router.push("/login")} />;
}
