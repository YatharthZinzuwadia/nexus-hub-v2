"use client";
import { useRouter } from "next/navigation";
import SplashScreen from "./components/screens/SplashScreen";

export default function Home() {
  const router = useRouter();

  const handleSplashComplete = () => {
    router.push("/onboarding/welcome");
  };
  return <SplashScreen onComplete={handleSplashComplete} />;
}
