"use client";

import { useRouter } from "next/navigation";
import LoginScreen from "../components/screens/LoginScreen";

const LoginPage = () => {
  const router = useRouter();
  return <LoginScreen onLogin={() => router.push("/dashboard")} />;
};

export default LoginPage;
