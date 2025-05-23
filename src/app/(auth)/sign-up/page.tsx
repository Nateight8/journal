"use client";
import { useQuery } from "@apollo/client";
import Authenticate from "./_components/authenticate";
import userOperations, { MeResponse } from "@/graphql/user-operations";
import { AccountSetup } from "./_components/steps/account-setup/account-setup";
import { SafetyNet } from "./_components/steps/safety/safety-net";
import { Personality } from "./_components/steps/personality/personality";
import { useRouter } from "next/navigation";

export default function Page() {
  const { data, loading } = useQuery<MeResponse>(userOperations.Queries.me);
  const router = useRouter();

  if (loading) {
    return <div className="">loading...from sign up</div>;
  }

  if (!data?.me) {
    return <Authenticate />;
  }

  if (data?.me.onboardingStep === "account_setup") {
    return <AccountSetup />;
  }

  if (data?.me.onboardingStep === "safety_net") {
    return <SafetyNet />;
  }

  if (data?.me.onboardingStep === "trading_style") {
    return <Personality />;
  }

  return router.push("/dashboard");
}
