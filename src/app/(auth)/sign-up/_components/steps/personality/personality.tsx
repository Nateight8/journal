"use client";

import * as React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

import { Form } from "@/components/ui/form";

import { useMutation } from "@apollo/client";

import { PersonalityForm } from "./personality-form";
import { accountOperations } from "@/graphql/account-operations";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CommandCenterPreview } from "./command-center";

// Define the experience levels as a constant to reuse in the form
export const experienceLevels = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
] as const;
export type ExperienceLevel = (typeof experienceLevels)[number];

// Define the challenges as a constant
export const challenges = [
  "RISK_MANAGEMENT",
  "CONSISTENCY",
  "PSYCHOLOGY",
  "PATIENCE",
] as const;
export type Challenge = (typeof challenges)[number];

// Define the currencies as a constant
export const currencies = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "NZD",
] as const;
export type Currency = (typeof currencies)[number];

// Define the trading session IDs as a type
export type TradingSessionId = "asian" | "london" | "newYork";

// Main form schema
export const FormSchema = z.object({
  // From AccountSetup
  tradingStyle: z.enum([
    "scalping",
    "dayTrading",
    "swingTrading",
    "positionTrading",
  ]),
  tradingSessions: z
    .array(z.enum(["asian", "london", "newYork"]))
    .min(1, "Select at least one trading session")
    .default(["asian"]),
  timeZone: z.string(),
  riskRewardRatio: z.number().min(1).max(10),
  note: z.string().optional(),
});

// Get trading account data from localStorage

// Infer the type from the schema
export type PersonalityFormValues = z.infer<typeof FormSchema>;

export function Personality() {
  const form = useForm<PersonalityFormValues>({
    // @ts-expect-error - The types from react-hook-form and zod don't perfectly align
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tradingStyle: "swingTrading" as const,
      tradingSessions: ["asian" as const],
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      riskRewardRatio: 2,
    },
  }) as unknown as UseFormReturn<PersonalityFormValues>;

  const [tradingAccount, setTradingAccount] = useState<{
    size: number;
    goal?: string;
    broker?: string;
    currency?: string;
    experience?: string;
    timestamp?: string;
    experienceLevel?: string;
    accountName?: string;
    accountCurrency?: string;
    dailyRisk?: number;
    dailyDrawdown?: number;
    totalDrawdown?: number;
    riskPerTrade?: number;
    maxOpenTrades?: number;
  } | null>(null);

  // Load trading account data on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("tradingAccount");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setTradingAccount(parsedData);
      }
    } catch (error) {
      console.error("Error loading trading account data:", error);
    }
  }, []);

  const [step, setStep] = React.useState(1);

  console.log(tradingAccount?.maxOpenTrades);

  const router = useRouter();
  const [createTradingPlan] = useMutation(
    accountOperations.Mutations.tradingPlan,
    {
      onCompleted: () => {
        localStorage.removeItem("tradingAccountData");
        router.push("/dashboard");
      },
    }
  );

  const onSubmit = (data: PersonalityFormValues) => {
    // Type assertion to handle the form values
    const formData = data as PersonalityFormValues;

    console.log("Form submitted FROM PERSON:", formData);
    // Handle form submission

    createTradingPlan({
      variables: {
        input: formData,
      },
    });

    // Save trading account data to localStorage
  };

  type TradingStyle =
    | "scalping"
    | "dayTrading"
    | "swingTrading"
    | "positionTrading";

  const getTradingStyleName = (style?: TradingStyle | string): string => {
    if (!style) return "Not specified";

    switch (style) {
      case "scalping":
        return "Scalping (The Sprinter)";
      case "dayTrading":
        return "Day Trading (The Day Warrior)";
      case "swingTrading":
        return "Swing Trading (The Patient Hunter)";
      case "positionTrading":
        return "Position Trading (The Marathon Runner)";
      default:
        return "Not specified";
    }
  };

  const tradingStyleName = getTradingStyleName(form.watch("tradingStyle"));

  const commandCenterValues = {
    accountName: tradingAccount?.accountName,
    accountSize: tradingAccount?.size,
    maxDailyRisk: tradingAccount?.dailyRisk,
    maxDailyDrawdown: tradingAccount?.dailyDrawdown,
    maxTotalDrawdown: tradingAccount?.totalDrawdown,
    riskPerTrade: tradingAccount?.riskPerTrade,
    tradingStyle: tradingStyleName,
    tradingSessions: form.watch("tradingSessions"),
    riskRewardRatio: form.watch("riskRewardRatio"),
    maxOpenTrades: tradingAccount?.maxOpenTrades,
  };

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl uppercase tracking-wider sm:text-4xl md:text-6xl">
            SETUP YOUR <span className="text-primary font-bold">Account</span>
          </h1>
          <p className="text-sm uppercase tracking-wider text-muted-foreground sm:text-base">
            ALMOST THERE, PLEASE FILL-UP ALL THE INFORMATION AND GET STARTED.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Main Content */}
              <Card className="border-border bg-card/50">
                <div className="border-b border-border p-6">
                  <h2 className="text-lg font-medium uppercase">
                    Trading Style
                  </h2>
                </div>
                <div className="p-6">
                  <div style={{ minHeight: "300px" }}>
                    {step === 1 && <PersonalityForm form={form} />}
                    {step === 2 && (
                      <CommandCenterPreview
                        commandCenterValues={commandCenterValues}
                      />
                    )}
                  </div>
                </div>
              </Card>

              {/* Right Column - Summary & Actions tradingAccount*/}
              <div className="space-y-6">
                <Card className="border-border bg-card/50">
                  <div className="border-b border-border p-6">
                    <h2 className="text-lg font-medium uppercase">
                      DETAILS & SUMMARY
                    </h2>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="rounded-lg bg-primary/10 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm uppercase text-muted-foreground">
                          Selected Goal
                        </span>
                        <span className="font-medium text-primary">
                          {tradingAccount?.goal || "Not selected"}
                        </span>
                      </div>
                    </div>

                    <>
                      {tradingAccount?.size ? (
                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm uppercase text-muted-foreground">
                              Account Size
                            </span>
                            <span className="font-medium">
                              ${tradingAccount?.size.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </>

                    {form.watch("tradingStyle") ? (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase text-muted-foreground">
                            Trading Style
                          </span>
                          <span className="font-medium">
                            {tradingStyleName}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {tradingAccount?.experienceLevel && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase text-muted-foreground">
                            Experience Level
                          </span>
                          <span className="font-medium capitalize">
                            {tradingAccount?.experienceLevel}
                          </span>
                        </div>
                      </div>
                    )}

                    {tradingAccount?.dailyRisk && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase text-muted-foreground">
                            Daily Risk
                          </span>
                          <span className="font-medium">
                            {tradingAccount?.dailyRisk}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="border-border bg-card/50">
                  <div className="space-y-2 p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">FREE</span>
                      <span className="text-sm text-muted-foreground">
                        PREMIUM FEATURES AVAILABLE LATER
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start with our free plan and upgrade anytime to unlock
                      advanced features
                    </p>
                  </div>
                  <div className="border-t border-border p-6">
                    {step === 1 && (
                      <button
                        disabled={step !== 1}
                        onClick={() => setStep(2)}
                        type="button"
                        className={cn(
                          "w-full hover:cursor-pointer rounded-md bg-primary py-4 text-center font-bold uppercase text-primary-foreground transition-all hover:bg-primary/90"
                        )}
                      >
                        CONTINUE
                      </button>
                    )}

                    {step === 2 && (
                      <button
                        type="submit"
                        // disabled={isSubmitting}
                        className={cn(
                          "w-full rounded-md hover:cursor-pointer bg-primary py-4 text-center font-bold uppercase text-primary-foreground transition-all hover:bg-primary/90"
                          // isSubmitting && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {/* {isSubmitting ? "PROCESSING..." : "GET STARTED"} */}
                        GET STARTED
                      </button>
                    )}

                    {step === 2 && (
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-3 w-full hover:cursor-pointer  rounded-md border border-border py-2 text-center text-sm uppercase text-muted-foreground transition-all hover:border-border/80 hover:text-foreground/80"
                      >
                        Back
                      </button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
}
