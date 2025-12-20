"use client";

import OnboardingFeatures from "@/app/components/screens/OnboardingFeatures";
import { useRouter } from "next/navigation";

export default function OnboardingFeaturesPage() {
  const router = useRouter();

  return (
    <OnboardingFeatures
      onNext={() => router.push("/onboarding/cta")}
      onSkip={() => router.push("/login")}
    />
  );
}
