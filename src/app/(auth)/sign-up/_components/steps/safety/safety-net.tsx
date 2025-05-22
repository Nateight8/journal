"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { RealityCheck } from "./reality-check";
import Safety from "./safety-form";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useMutation } from "@apollo/client";
import { accountOperations } from "@/graphql/account-operations";
import userOperations from "@/graphql/user-operations";

// Main form schema
export const FormSchema = z.object({
  maxDailyRisk: z.number().min(0.1).max(10),
  maxDailyDrawdown: z.number().min(0.1).max(20),
  maxTotalDrawdown: z.number().min(1).max(50),
  riskPerTrade: z.number().min(0.1).max(5),
  maxOpenTrades: z.number().int().min(1).max(20),
});

// Infer the type from the schema
export type SafetyFormData = z.infer<typeof FormSchema>;

export function SafetyNet() {
  const form = useForm<SafetyFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      maxDailyRisk: 2,
      maxDailyDrawdown: 4,
      maxTotalDrawdown: 10,
      riskPerTrade: 1,
      maxOpenTrades: 2,
    },
  });

  const [step, setStep] = useState(1);
  const [createSafetyNet] = useMutation(accountOperations.Mutations.safetyNet, {
    refetchQueries: [userOperations.Queries.me],
    onCompleted: () => {
      // This will trigger a refetch of the me query
      // which will update the onboarding step in the UI
    },
  });

  const dailyRisk = form.watch("maxDailyRisk");

  // Get trading account data from localStorage
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
  } | null>(null);

  // Load trading account data on component mount
  React.useEffect(() => {
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

  const onSubmit = (data: SafetyFormData) => {
    createSafetyNet({
      variables: {
        input: {
          maxDailyRisk: data.maxDailyRisk,
          maxDailyDrawdown: data.maxDailyDrawdown,
          maxTotalDrawdown: data.maxTotalDrawdown,
          riskPerTrade: data.riskPerTrade,
          maxOpenTrades: data.maxOpenTrades,
        },
      },
    });
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
                    REALITY CHECK
                  </h2>
                </div>
                <div className="p-6">
                  <div style={{ minHeight: "300px" }}>
                    {step === 1 && <RealityCheck />}
                    {step === 2 && (
                      <Safety
                        form={form}
                        isPropChallenge={tradingAccount?.goal === "PROP"}
                        accountSize={tradingAccount?.size || 10000}
                      />
                    )}
                  </div>
                </div>
              </Card>

              {/* Right Column - Summary & Actions */}
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
                        {tradingAccount ? (
                          <span className="font-medium text-primary">
                            {tradingAccount?.goal === "PROP"
                              ? "Prop Firm Challenge"
                              : "Individual"}
                          </span>
                        ) : (
                          <span className="font-medium text-primary">
                            Not selected
                          </span>
                        )}
                      </div>
                    </div>

                    {tradingAccount?.size && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase text-muted-foreground">
                            Account Size
                          </span>
                          <span className="font-medium">
                            ${tradingAccount?.size?.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

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

                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm uppercase text-muted-foreground">
                            Daily Risk Limit
                          </span>
                          {step !== 2 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="h-4 w-4 text-muted-foreground/70" />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="top"
                                  className="max-w-[200px] text-center"
                                >
                                  <p>
                                    This will be set in the next step based on
                                    your risk parameters
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <span className="font-medium">{dailyRisk}%</span>
                      </div>
                    </div>

                    {/* {tradingAccount?.biggestChallenge && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase text-muted-foreground">
                            Biggest Challenge
                          </span>
                          <span className="font-medium">
                            {tradingAccount?.biggestChallenge}%
                          </span>
                        </div>
                      </div>
                    )} */}
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
