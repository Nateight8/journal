"use client";

import Authenticate from "./_components/authenticate";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (user?.onboardingStep === "account_setup") {
    return router.push("/onboarding");
  }

  if (user) {
    return router.push("/dashboard");
  }

  if (loading) {
    return <div className="">loading...from sign up</div>;
  }

  return <Authenticate />;
}
