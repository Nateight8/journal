"use client";

import { useFormContext } from "react-hook-form";
import { BookOpen, LineChart, Shield, Trophy } from "lucide-react";
import { OnboardingFormValues } from "../onboard";
import { FormError } from "../form-error";
import { cn } from "@/lib/utils";

export function GoalSetting() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  const selectedIntents = watch("intent") || [];

  const handleToggleIntent = (intent: string) => {
    const currentIntents = [...selectedIntents];

    if (currentIntents.includes(intent as any)) {
      setValue(
        "intent",
        currentIntents.filter((i) => i !== intent),
        { shouldValidate: true }
      );
    } else {
      setValue("intent", [...currentIntents, intent as any], {
        shouldValidate: true,
      });
    }
  };

  const options = [
    {
      id: "propFirmChallenge",
      icon: Trophy,
      title: "PROP FIRM CHALLENGE",
      description:
        "Get ready to pass your prop firm evaluation with disciplined trading",
    },
    {
      id: "improvingTrading",
      icon: LineChart,
      title: "IMPROVING EXISTING TRADING",
      description:
        "Take your trading to the next level with advanced analytics",
    },
    {
      id: "tradingDiscipline",
      icon: Shield,
      title: "NEED TRADING DISCIPLINE",
      description: "Tired of blown accounts? Build a systematic approach",
    },
    {
      id: "tradeAnalytics",
      icon: BookOpen,
      title: "BETTER TRADE ANALYTICS",
      description: "Gain insights into your trading patterns and performance",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">
          What brings you to Trading Mongopark?
        </h3>
        <p className="text-sm text-muted-foreground">
          Select all that apply to personalize your experience
        </p>
      </div>

      <div className="grid gap-3">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedIntents.includes(option.id as any);

          return (
            <button
              key={option.id}
              type="button"
              className={cn(
                "flex items-center gap-4 rounded-md border border-border bg-secondary/50 p-4 text-left transition-all hover:border-primary/50",
                isSelected && "border-2 border-primary"
              )}
              onClick={() => handleToggleIntent(option.id)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{option.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2",
                  isSelected ? "border-primary bg-primary" : "border-muted"
                )}
              />
            </button>
          );
        })}
      </div>

      {errors.intent && <FormError message={errors.intent.message} />}

      <input type="hidden" {...register("intent")} />
    </div>
  );
}
