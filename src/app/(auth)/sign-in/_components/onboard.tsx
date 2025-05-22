"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

import { GoalSetting } from "./steps/goal-setting";
import { TradingIdentity } from "./steps/trading-identity";
import { RealityCheck } from "./steps/reality-check";

import { TradingPersonality } from "./steps/trading-personality";
import { CommandCenterPreview } from "./steps/command-center-preview";
import { SafetyNetSetup } from "./steps/safety-net";
import { OnboardingProgress } from "./progress";

// Define the form schema with Zod
const formSchema = z.object({
  // Step 1: Goal Setting
  intent: z
    .array(
      z.enum([
        "propFirmChallenge",
        "improvingTrading",
        "tradingDiscipline",
        "tradeAnalytics",
      ])
    )
    .min(1, "Select at least one goal"),

  // Step 2: Trading Identity
  propFirm: z.string().optional().nullable(),
  accountName: z.string().min(1, "Account name is required"),
  broker: z.string().min(1, "Broker is required"),
  accountCurrency: z.string().min(1, "Currency is required"),
  accountSize: z.number().min(1, "Account size is required"),
  experienceLevel: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional()
    .nullable(),
  biggestChallenge: z.array(
    z.enum(["riskManagement", "consistency", "emotions"])
  ),

  // Step 3: Reality Check
  planNote: z.string().optional(),

  // Step 4: Safety Net Setup
  maxDailyRisk: z.number().min(0.1).max(10),
  maxDailyDrawdown: z.number().min(0.1).max(20),
  maxTotalDrawdown: z.number().min(1).max(50),
  riskPerTrade: z.number().min(0.1).max(5),
  maxOpenTrades: z.number().int().min(1).max(20),

  // Step 5: Trading Personality
  tradingStyle: z.enum([
    "scalping",
    "dayTrading",
    "swingTrading",
    "positionTrading",
  ]),
  tradingSessions: z
    .array(z.enum(["asian", "london", "newYork"]))
    .min(1, "Select at least one trading session"),
  timeZone: z.string(),
  riskRewardRatio: z.number().min(1).max(10),
});

export type OnboardingFormValues = z.infer<typeof formSchema>;

// Define validation schemas for each step
const stepValidationSchemas = [
  // Step 1: Goal Setting
  z.object({
    intent: z
      .array(
        z.enum([
          "propFirmChallenge",
          "improvingTrading",
          "tradingDiscipline",
          "tradeAnalytics",
        ])
      )
      .min(1, "Select at least one goal"),
  }),

  // Step 2: Trading Identity
  z.object({
    accountName: z.string().min(1, "Account name is required"),
    broker: z.string().min(1, "Broker is required"),
    accountCurrency: z.string().min(1, "Currency is required"),
    accountSize: z.number().min(1, "Account size is required"),
    propFirm: z.string().optional().nullable(),
    experienceLevel: z
      .enum(["beginner", "intermediate", "advanced"])
      .optional()
      .nullable(),
    biggestChallenge: z
      .array(z.enum(["riskManagement", "consistency", "emotions"]))
      .optional()
      .default([]),
  }),

  // Step 3: Reality Check
  z.object({
    planNote: z.string().optional(),
  }),

  // Step 4: Safety Net Setup
  z.object({
    maxDailyRisk: z.number().min(0.1).max(10),
    maxDailyDrawdown: z.number().min(0.1).max(20),
    maxTotalDrawdown: z.number().min(1).max(50),
    riskPerTrade: z.number().min(0.1).max(5),
    maxOpenTrades: z.number().int().min(1).max(20),
  }),

  // Step 5: Trading Personality
  z.object({
    tradingStyle: z.enum([
      "scalping",
      "dayTrading",
      "swingTrading",
      "positionTrading",
    ]),
    tradingSessions: z
      .array(z.enum(["asian", "london", "newYork"]))
      .min(1, "Select at least one trading session"),
    timeZone: z.string(),
    riskRewardRatio: z.number().min(1).max(10),
  }),

  // Step 6: Command Center Preview (no validation needed)
  z.object({}),
];

export function Onboard() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [shakeError, setShakeError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maxDailyRisk: 2,
      maxDailyDrawdown: 3,
      maxTotalDrawdown: 5,
      riskPerTrade: 1,
      maxOpenTrades: 3,
      riskRewardRatio: 2,
      tradingSessions: ["london", "newYork"],
      timeZone: "UTC",
      accountSize: 10000,
      accountCurrency: "USD",
      biggestChallenge: [],
    },
    mode: "onChange",
  });

  const steps = [
    { id: "goal-setting", component: GoalSetting, title: "Select Goal" },
    {
      id: "trading-identity",
      component: TradingIdentity,
      title: "Trading Identity",
    },
    { id: "reality-check", component: RealityCheck, title: "Reality Check" },
    { id: "safety-net-setup", component: SafetyNetSetup, title: "Safety Net" },
    {
      id: "trading-personality",
      component: TradingPersonality,
      title: "Trading Style",
    },
    {
      id: "command-center-preview",
      component: CommandCenterPreview,
      title: "Command Center",
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  // Reset shake animation after it completes
  useEffect(() => {
    if (shakeError) {
      const timer = setTimeout(() => {
        setShakeError(false);
      }, 500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [shakeError]);

  const validateCurrentStep = async () => {
    try {
      const currentSchema = stepValidationSchemas[currentStep];
      const formValues = methods.getValues();

      // Clean up form data before validation
      const cleanedValues = {
        ...formValues,
        experienceLevel: formValues.experienceLevel || null,
        propFirm: formValues.propFirm || null,
        biggestChallenge: formValues.biggestChallenge || [],
      };

      await currentSchema.parseAsync(cleanedValues);
      return true;
    } catch (error) {
      console.error("Validation error:", error);
      setShakeError(true);
      return false;
    }
  };

  const goToNextStep = async () => {
    if (isSubmitting) return;

    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (data: OnboardingFormValues) => {
    console.log("Form submission started");
    console.log("Current step:", currentStep);
    console.log("Form data:", data);
    console.log("Intent:", data.intent);
    console.log("Prop Firm:", data.propFirm);

    if (isSubmitting) {
      console.log("Already submitting, returning");
      return;
    }

    try {
      console.log("Setting isSubmitting to true");
      setIsSubmitting(true);

      // Validate prop firm selection if prop firm challenge is selected
      if (data.intent.includes("propFirmChallenge") && !data.propFirm) {
        console.log("Prop firm challenge selected but no prop firm chosen");
        setShakeError(true);
        return;
      }

      // Skip step validation on final step since we're submitting the whole form
      if (currentStep !== steps.length - 1) {
        console.log("Validating current step");
        const isValid = await validateCurrentStep();
        console.log("Validation result:", isValid);

        if (!isValid) {
          console.log("Validation failed, returning");
          return;
        }
      }

      // Rest of the code...
      console.log("Preparing onboarding data");
      const onboardingData = {
        dailyRiskPercentage: data.maxDailyRisk,
        maxDrawdownPercentage: data.maxTotalDrawdown,
        riskPerTradePercentage: data.riskPerTrade,
        riskRewardRatio: data.riskRewardRatio,
        tradingSessions: data.tradingSessions.map((session) =>
          session.toUpperCase()
        ),
        timezone: data.timeZone,
        tradingStyle: data.tradingStyle.toUpperCase(),
        intent: data.intent.map((intent) => intent.toUpperCase()),
        accountName: data.accountName,
        broker: data.broker,
        currency: data.accountCurrency,
        accountSize: data.accountSize,
        experienceLevel: data.experienceLevel?.toUpperCase(),
        biggestChallenge: data.biggestChallenge?.map((challenge) =>
          challenge.toUpperCase()
        ),
        propFirm: data.propFirm || undefined,
        tradingPlan: data.planNote,
      };
      console.log("Onboarding data prepared:", onboardingData);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setShakeError(true);
    } finally {
      console.log("Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-4xl uppercase tracking-wider sm:text-4xl md:text-6xl">
          SETUP YOUR <span className="text-primary font-bold">Account</span>
        </h1>
        <p className="text-sm uppercase tracking-wider text-muted-foreground sm:text-base">
          ALMOST THERE, PLEASE FILL-UP ALL THE INFORMATION AND GET STARTED.
        </p>
      </div>

      <FormProvider {...methods}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log("Form onSubmit triggered");
            console.log("Current step:", currentStep);
            console.log("Total steps:", steps.length);
            console.log("Is final step?", currentStep === steps.length - 1);

            try {
              if (currentStep === steps.length - 1) {
                console.log("On final step, attempting form submission");
                const result = await methods.handleSubmit(
                  (data) => {
                    console.log("Form validation passed, data:", data);
                    return handleSubmit(data);
                  },
                  (errors) => {
                    console.log("Form validation failed, errors:", errors);
                  }
                )(e);
                console.log("Form submission result:", result);
              } else {
                console.log("Not on final step, going to next step");
                await goToNextStep();
              }
            } catch (error) {
              console.error("Error in form submission:", error);
            }
          }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Column - Main Content */}
            <div
              className={cn(
                "transition-all duration-300",
                shakeError && "animate-shake"
              )}
            >
              <Card className="border-border bg-card/50">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h2 className="flex items-center gap-2 text-lg font-medium uppercase">
                    <ArrowRight className="h-4 w-4 text-primary" />
                    {steps[currentStep].title}
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </h2>
                  <OnboardingProgress
                    currentStep={currentStep}
                    totalSteps={steps.length}
                  />
                </div>
                <div className="p-6">
                  <CurrentStepComponent />
                </div>
              </Card>
            </div>

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
                        {methods.watch("intent")?.includes("propFirmChallenge")
                          ? "Prop Firm Challenge"
                          : methods
                              .watch("intent")
                              ?.includes("improvingTrading")
                          ? "Improving Trading"
                          : methods
                              .watch("intent")
                              ?.includes("tradingDiscipline")
                          ? "Trading Discipline"
                          : "Trade Analytics"}
                      </span>
                    </div>
                  </div>

                  {methods.watch("accountSize") && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm uppercase text-muted-foreground">
                          Account Size
                        </span>
                        <span className="font-medium">
                          $
                          {Number.parseInt(
                            methods.watch("accountSize").toString()
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}

                  {methods.watch("tradingStyle") && (
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm uppercase text-muted-foreground">
                          Trading Style
                        </span>
                        <span className="font-medium">
                          {methods.watch("tradingStyle") === "scalping"
                            ? "Scalping"
                            : methods.watch("tradingStyle") === "dayTrading"
                            ? "Day Trading"
                            : methods.watch("tradingStyle") === "swingTrading"
                            ? "Swing Trading"
                            : "Position Trading"}
                        </span>
                      </div>
                    </div>
                  )}

                  {methods.watch("maxDailyRisk") && (
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
                  {currentStep === steps.length - 1 ? (
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
                  )}

                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={goToPreviousStep}
                      className="mt-3 w-full rounded-md border border-border py-2 text-center text-sm uppercase text-muted-foreground transition-all hover:border-border/80 hover:text-foreground/80"
                    >
                      Back
                    </button>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
