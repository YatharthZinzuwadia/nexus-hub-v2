"use client";

import { useRouter, usePathname } from "next/navigation";
import LoginScreen from "../components/screens/LoginScreen";
import PageTransition from "../components/effects/PageTransition";

const LoginPage = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <PageTransition transitionKey={pathname}>
      <LoginScreen onLogin={() => router.push("/dashboard")} />
    </PageTransition>
  );
};

export default LoginPage;
