"use client";

import { useFormContext } from "react-hook-form";
import { Clock, Hourglass, Lightbulb, Timer, Zap } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

import { FormError } from "../form-error";
import { OnboardingFormValues } from "../onboard";

type TradingStyle = {
  id: OnboardingFormValues["tradingStyle"];
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  holdingTime: string;
  bestSessions: string;
  riskConsiderations: string;
  practitioners: string;
};

type TradingSession = {
  id: OnboardingFormValues["tradingSessions"][number];
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function TradingPersonality() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  const selectedStyle = watch("tradingStyle");
  const selectedSessions = watch("tradingSessions") || [];

  const tradingStyles: TradingStyle[] = [
    {
      id: "scalping",
      name: "THE SPRINTER",
      description: "Quick in-and-out trades, multiple positions per day",
      icon: Zap,
      holdingTime: "Minutes to hours",
      bestSessions: "High volatility sessions",
      riskConsiderations: "Requires intense focus, quick decisions",
      practitioners: "Navinder Sarao, Paul Tudor Jones",
    },
    {
      id: "dayTrading",
      name: "THE DAY WARRIOR",
      description: "Trades completed within the same day",
      icon: Timer,
      holdingTime: "Hours",
      bestSessions: "Market open/close",
      riskConsiderations: "Balanced approach, defined daily goals",
      practitioners: "Steven Cohen, Andrew Aziz",
    },
    {
      id: "swingTrading",
      name: "THE PATIENT HUNTER",
      description: "Waits for perfect setups, holds for days",
      icon: Lightbulb,
      holdingTime: "Days to weeks",
      bestSessions: "Any, less screen time needed",
      riskConsiderations: "Larger stop losses, smaller position sizes",
      practitioners: "Mark Minervini, William O'Neil",
    },
    {
      id: "positionTrading",
      name: "THE MARATHON RUNNER",
      description: "Follows long-term trends, minimal trading",
      icon: Hourglass,
      holdingTime: "Weeks to months",
      bestSessions: "Any, minimal monitoring",
      riskConsiderations: "Very wide stops, small positions",
      practitioners: "Warren Buffett, Ray Dalio",
    },
  ];

  const tradingSessions: TradingSession[] = [
    {
      id: "asian",
      name: "Asian Session",
      description: "Tokyo, Singapore, Sydney markets",
      icon: Lightbulb,
    },
    {
      id: "london",
      name: "London Session",
      description: "European markets",
      icon: Lightbulb,
    },
    {
      id: "newYork",
      name: "New York Session",
      description: "US markets",
      icon: Lightbulb,
    },
  ];

  const timezones = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" },
    { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
    { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  ] as const;

  const riskRewardOptions = [
    { value: "1", label: "1:1 - Equal risk and reward" },
    { value: "2", label: "1:2 - Twice as much reward as risk" },
    { value: "3", label: "1:3 - Three times as much reward as risk" },
    { value: "4", label: "1:4 - Four times as much reward as risk" },
    { value: "5", label: "1:5 - Five times as much reward as risk" },
  ] as const;

  const handleSelectStyle = (style: OnboardingFormValues["tradingStyle"]) => {
    setValue("tradingStyle", style, { shouldValidate: true });
  };

  const handleSessionToggle = (
    session: OnboardingFormValues["tradingSessions"][number]
  ) => {
    const currentSessions = [...selectedSessions];

    if (currentSessions.includes(session)) {
      setValue(
        "tradingSessions",
        currentSessions.filter((s) => s !== session),
        { shouldValidate: true }
      );
    } else {
      setValue("tradingSessions", [...currentSessions, session], {
        shouldValidate: true,
      });
    }
  };

  const handleRiskRewardChange = (value: string) => {
    setValue("riskRewardRatio", Number(value), { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Your Trading Personality</h3>
        <p className="text-sm text-muted-foreground">
          Define your trading style and preferences
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm uppercase text-muted-foreground">
          SELECT — TRADING STYLE
        </Label>
        <div className="grid gap-3">
          {tradingStyles.map((style) => {
            const Icon = style.icon;
            const isSelected = selectedStyle === style.id;

            return (
              <button
                key={style.id}
                type="button"
                className={cn(
                  "flex flex-col rounded-md border border-border bg-secondary/50 p-4 text-left transition-all hover:border-primary/50",
                  isSelected && "border-2 border-primary"
                )}
                onClick={() =>
                  handleSelectStyle(
                    style.id as OnboardingFormValues["tradingStyle"]
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="font-medium">{style.name}</div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {style.description}
                </p>

                {isSelected && (
                  <div className="mt-3 grid gap-2 rounded-md bg-card p-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-foreground/80">
                          Holding Time:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {style.holdingTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-foreground/80">
                          Best Sessions:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {style.bestSessions}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="font-medium text-foreground/80">
                          Notable Traders:
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {style.practitioners}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.tradingStyle && (
          <FormError message={errors.tradingStyle.message} />
        )}
      </div>

      <div className="space-y-3">
        <Label className="text-sm uppercase text-muted-foreground">
          Trading Sessions
        </Label>
        <div className="grid gap-2">
          {tradingSessions.map((session) => (
            <div
              key={session.id}
              className={cn(
                "flex items-center rounded-md border border-border bg-secondary/50 p-3 transition-all",
                selectedSessions.includes(session.id) && "border-primary"
              )}
            >
              <Checkbox
                id={session.id}
                checked={selectedSessions.includes(session.id)}
                onCheckedChange={() => handleSessionToggle(session.id)}
                className="border-muted text-primary"
              />
              <Label
                htmlFor={session.id}
                className="ml-2 flex-1 cursor-pointer"
              >
                {session.name}{" "}
                <span className="text-xs text-muted-foreground">
                  ({session.description})
                </span>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="timeZone"
          className="text-sm uppercase text-muted-foreground"
        >
          SELECT — TIMEZONE
        </Label>
        <Select
          onValueChange={(value) =>
            setValue("timeZone", value, { shouldValidate: true })
          }
          defaultValue={watch("timeZone")}
        >
          <SelectTrigger
            className={cn(
              "rounded-md border-border bg-secondary/50 text-foreground focus:border-primary focus:ring-primary",
              errors.timeZone &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent className="rounded-md border-border bg-card text-foreground">
            {timezones.map((timezone) => (
              <SelectItem key={timezone.value} value={timezone.value}>
                {timezone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.timeZone && <FormError message={errors.timeZone.message} />}
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="riskRewardRatio"
          className="text-sm uppercase text-muted-foreground"
        >
          SELECT — RISK:REWARD RATIO
        </Label>
        <Select
          onValueChange={handleRiskRewardChange}
          defaultValue={String(watch("riskRewardRatio"))}
        >
          <SelectTrigger
            className={cn(
              "rounded-md border-border bg-secondary/50 text-foreground focus:border-primary focus:ring-primary",
              errors.riskRewardRatio &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <SelectValue placeholder="Select risk:reward ratio" />
          </SelectTrigger>
          <SelectContent className="rounded-md border-border bg-card text-foreground">
            {riskRewardOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          This ratio determines how much potential profit you aim for relative
          to your risk
        </p>
        {errors.riskRewardRatio && (
          <FormError message={errors.riskRewardRatio.message} />
        )}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="planNote"
          className="text-sm uppercase text-muted-foreground"
        >
          Trading Plan Notes (Optional)
        </Label>
        <Textarea
          id="planNote"
          placeholder="Add any additional notes about your trading plan..."
          {...register("planNote")}
          className="min-h-[100px] rounded-md border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
        />
      </div>

      <input type="hidden" {...register("tradingStyle")} />
    </div>
  );
}
