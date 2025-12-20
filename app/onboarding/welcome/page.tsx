"use client";

import OnboardingWelcome from "@/app/components/screens/OnboardingWelcome";
import { useRouter } from "next/navigation";

export default function OnboardingWelcomePage() {
  const router = useRouter();

  return (
    <OnboardingWelcome
      onNext={() => router.push("/onboarding/features")}
      onSkip={() => router.push("/login")}
    />
  );
}
