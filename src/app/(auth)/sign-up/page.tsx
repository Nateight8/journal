"use client";
import { useQuery } from "@apollo/client";
import Authenticate from "./_components/authenticate";
import userOperations, { MeResponse } from "@/graphql/user-operations";
import { AccountSetup } from "./_components/steps/account-setup/account-setuo";

export default function Page() {
  const { data, loading } = useQuery<MeResponse>(userOperations.Queries.me);

  if (loading) {
    return <div className="">loading...from sign up</div>;
  }

  if (!data?.me) {
    return <Authenticate />;
  }

  if (data?.me.onboardingStep === "account_setup") {
    return <AccountSetup />;
  }

  return <div className="">completed</div>;
}
