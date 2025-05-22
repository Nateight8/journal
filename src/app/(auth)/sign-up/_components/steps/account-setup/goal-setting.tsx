"use client";

import { BookOpen, LineChart, Shield, Trophy } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Label } from "@/components/ui/label";

import { type UseFormReturn } from "react-hook-form";
import { type OnboardingFormValues } from "./account-setuo";

export function GoalSetting({
  form,
}: {
  form: UseFormReturn<OnboardingFormValues>;
}) {
  const options = [
    {
      id: "PROP",
      icon: Trophy,
      title: "PROP FIRM CHALLENGE",
      description:
        "Get ready to pass your prop firm evaluation with disciplined trading",
    },
    {
      id: "IMPROVE",
      icon: LineChart,
      title: "IMPROVING EXISTING TRADING",
      description:
        "Take your trading to the next level with advanced analytics",
    },
    {
      id: "DISCIPLINE",
      icon: Shield,
      title: "NEED TRADING DISCIPLINE",
      description: "Tired of blown accounts? Build a systematic approach",
    },
    {
      id: "ANALYTICS",
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

      <FormField
        control={form.control}
        name="goal"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value || ""}
                className="flex flex-col space-y-3"
              >
                {options.map((option) => {
                  const Icon = option.icon;
                  return (
                    <FormItem key={option.id} className="relative">
                      <Label className="flex items-center gap-4 hover:cursor-pointer rounded-md border border-border bg-secondary/50 p-4 text-left transition-all hover:border-primary/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="grid grow gap-1">
                          <Label htmlFor={option.id} className="font-medium">
                            {option.title}
                          </Label>
                          <p
                            id={`${option.id}-description`}
                            className="text-muted-foreground text-sm"
                          >
                            {option.description}
                          </p>
                        </div>
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          checked={field.value === option.id}
                          aria-describedby={`${option.id}-description`}
                        />
                      </Label>
                    </FormItem>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
