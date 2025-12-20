"use client";
import { usePathname } from "next/navigation";
import PageTransition from "../components/effects/PageTransition";

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <div className="w-full h-screen bg-black">
      <PageTransition transitionKey={pathname}>{children}</PageTransition>
    </div>
  );
};

export default OnboardingLayout;
