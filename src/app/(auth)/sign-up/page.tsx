"use client";

import Authenticate from "./_components/authenticate";

import { AccountSetup } from "./_components/steps/account-setup/account-setup";
import { SafetyNet } from "./_components/steps/safety/safety-net";
import { Personality } from "./_components/steps/personality/personality";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div className="">loading...from sign up</div>;
  }

  if (!user) {
    return <Authenticate />;
  }

  if (user.onboardingStep === "account_setup") {
    return <AccountSetup />;
  }

  if (user.onboardingStep === "safety_net") {
    return <SafetyNet />;
  }

  if (user.onboardingStep === "trading_style") {
    return <Personality />;
  }

  return router.push("/dashboard");
}
