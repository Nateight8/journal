"use client";

import * as React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

import { Form } from "@/components/ui/form";
import { accountOperations } from "@/graphql/account-operations";
import { useAuth } from "@/contexts/auth-context";
import { AccountProfile } from "./account-profile";
import { GoalSetting } from "./goal-setting";

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

// Define the prop firms as a constant
export const propFirms = [
  "ftmo",
  "trueForex",
  "fundedNext",
  "theFundedTrader",
] as const;
export type PropFirm = (typeof propFirms)[number];

// Account sizes in cents to avoid floating point precision issues
export const accountSizes = [
  5000, 10000, 25000, 50000, 100000, 200000,
] as const;
export type AccountSize = (typeof accountSizes)[number];

// Define the goal options as a constant
export const goalOptions = [
  "PROP",
  "IMPROVE",
  "DISCIPLINE",
  "ANALYTICS",
] as const;

export type GoalOption = (typeof goalOptions)[number];

// Main form schema
export const FormSchema = z.object({
  // From AccountSetup
  goal: z.enum(goalOptions),

  // From AccountProfile
  propFirm: z.enum(propFirms).optional(),
  accountSize: z.number().positive("Please select an account size"),
  experienceLevel: z.enum(experienceLevels).optional(),
  biggestChallenge: z.array(z.enum(challenges)).optional(),
  accountName: z
    .string()
    .min(2, "Account name must be at least 2 characters")
    .max(50, "Account name must be less than 50 characters"),
  broker: z
    .string()
    .min(2, "Broker name must be at least 2 characters")
    .max(50, "Broker name must be less than 50 characters"),
  accountCurrency: z.enum(currencies),
});

// Infer the type from the schema
export type OnboardingFormValues = z.infer<typeof FormSchema>;

export function AccountSetup() {
  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      goal: undefined,
      propFirm: undefined,
      accountSize: 0,
      experienceLevel: undefined,
      biggestChallenge: [],
      accountName: "",
      broker: "",
      accountCurrency: "USD",
    },
  });

  const [step, setStep] = React.useState(1);
  const { refetchUser } = useAuth();
  const [setUpAccount] = useMutation(accountOperations.Mutations.setUpAccount, {
    onCompleted: async () => {
      try {
        // This will update the user data in the auth context
        await refetchUser();
      } catch (error) {
        console.error("Error refetching user data:", error);
      }
    },
  });

  const onSubmit = (data: OnboardingFormValues) => {
    // Save trading account data to localStorage
    localStorage.setItem(
      "tradingAccount",
      JSON.stringify({
        size: data.accountSize,
        goal: data.goal,
        experienceLevel: data.experienceLevel,
        biggestChallenge: data.biggestChallenge,
        accountName: data.accountName,
        broker: data.broker,
        accountCurrency: data.accountCurrency,
      })
    );

    setUpAccount({
      variables: {
        input: {
          ...data,
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
                    ACCOUNT SETUP
                  </h2>
                </div>
                <div className="p-6">
                  <div style={{ minHeight: "300px" }}>
                    {step === 1 && <GoalSetting form={form} />}
                    {step === 2 && <AccountProfile form={form} />}
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
                        <span className="font-medium text-primary">
                          {form.watch("goal") || "Not selected"}
                        </span>
                      </div>
                    </div>

                    <>
                      {form.watch("accountSize") ? (
                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm uppercase text-muted-foreground">
                              Account Size
                            </span>
                            <span className="font-medium">
                              ${form.watch("accountSize")?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </>

                    {form.watch("experienceLevel") && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm uppercase text-muted-foreground">
                            Experience Level
                          </span>
                          <span className="font-medium capitalize">
                            {form.watch("experienceLevel")}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* {form.watch("maxDailyRisk") && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm uppercase text-muted-foreground">
                          Daily Risk
                        </span>
                        <span className="font-medium">
                          {methods.watch("maxDailyRisk")}%
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
                    {/* { (
                    // On final step, show submit button
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full rounded-md bg-primary py-4 text-center font-bold uppercase text-primary-foreground transition-all hover:bg-primary/90",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {isSubmitting ? "PROCESSING..." : "GET STARTED"}
                    </button>
                  ) : (
                    // On other steps, show continue button
                    <button
                      type="button"
                      onClick={goToNextStep}
                      className="w-full rounded-md bg-primary py-4 text-center font-bold uppercase text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      CONTINUE
                    </button>
                  )} */}

                    {/* {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="mt-3 w-full rounded-md border border-border py-2 text-center text-sm uppercase text-muted-foreground transition-all hover:border-border/80 hover:text-foreground/80"
                    >
                      Back
                    </button>
                  )} */}
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
