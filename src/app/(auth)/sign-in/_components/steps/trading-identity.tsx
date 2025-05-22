"use client";

import { useFormContext } from "react-hook-form";
import { DollarSign } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { OnboardingFormValues } from "../onboard";
import { FormError } from "../form-error";

type AccountSize = {
  value: number;
  label: string;
  popular?: boolean;
};

export function TradingIdentity() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingFormValues>();

  const intent = watch("intent") || [];
  const selectedPropFirm = watch("propFirm");
  const selectedExperience = watch("experienceLevel");
  const selectedChallenges = watch("biggestChallenge") || [];
  const selectedAccountSize = watch("accountSize");

  const propFirms = [
    { id: "ftmo", name: "FTMO", logo: "FTMO" },
    { id: "trueForex", name: "TRUE FOREX", logo: "TF" },
    { id: "fundedNext", name: "FUNDED NEXT", logo: "FN" },
    { id: "theFundedTrader", name: "THE FUNDED TRADER", logo: "TFT" },
  ] as const;

  const accountSizes: AccountSize[] = [
    { value: 5000, label: "$5K" },
    { value: 10000, label: "$10K", popular: true },
    { value: 25000, label: "$25K" },
    { value: 50000, label: "$50K" },
    { value: 100000, label: "$100K" },
    { value: 200000, label: "$200K" },
  ];

  const experienceLevels = [
    { value: "beginner", label: "Beginner (< 1 year)" },
    { value: "intermediate", label: "Intermediate (1-2 years)" },
    { value: "advanced", label: "Advanced (3+ years)" },
  ] as const;

  const challenges = [
    { value: "riskManagement", label: "Risk Management" },
    { value: "consistency", label: "Consistency" },
    { value: "emotions", label: "Emotional Control" },
  ] as const;

  const currencies = [
    { value: "USD", label: "US Dollar (USD)" },
    { value: "EUR", label: "Euro (EUR)" },
    { value: "GBP", label: "British Pound (GBP)" },
    { value: "JPY", label: "Japanese Yen (JPY)" },
    { value: "AUD", label: "Australian Dollar (AUD)" },
    { value: "CAD", label: "Canadian Dollar (CAD)" },
    { value: "CHF", label: "Swiss Franc (CHF)" },
    { value: "NZD", label: "New Zealand Dollar (NZD)" },
  ] as const;

  const handleSelectPropFirm = (propFirm: string) => {
    setValue("propFirm", propFirm, { shouldValidate: true });
  };

  const handleSelectAccountSize = (size: number) => {
    setValue("accountSize", size, { shouldValidate: true });
  };

  const handleSelectExperience = (
    level: OnboardingFormValues["experienceLevel"]
  ) => {
    setValue("experienceLevel", level, { shouldValidate: true });
  };

  const handleToggleChallenge = (
    challenge: OnboardingFormValues["biggestChallenge"][number]
  ) => {
    const currentChallenges = [...selectedChallenges];

    if (currentChallenges.includes(challenge)) {
      setValue(
        "biggestChallenge",
        currentChallenges.filter((c) => c !== challenge),
        { shouldValidate: true }
      );
    } else {
      setValue("biggestChallenge", [...currentChallenges, challenge], {
        shouldValidate: true,
      });
    }
  };

  const isPropFirmSelected = intent.includes("propFirmChallenge");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Your Trading Identity</h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your trading journey
        </p>
      </div>

      {isPropFirmSelected && (
        <>
          <div className="space-y-3">
            <Label className="text-sm uppercase text-muted-foreground">
              SELECT — PROP FIRM
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {propFirms.map((firm) => (
                <button
                  key={firm.id}
                  type="button"
                  className={cn(
                    "flex flex-col items-center rounded-md border border-border bg-secondary/50 p-4 transition-all hover:border-primary/50",
                    selectedPropFirm === firm.id && "border-2 border-primary"
                  )}
                  onClick={() => handleSelectPropFirm(firm.id)}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary font-bold text-primary">
                    {firm.logo}
                  </div>
                  <span className="mt-2 text-sm font-medium">{firm.name}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="space-y-3">
        <Label className="text-sm uppercase text-muted-foreground">
          SELECT — ACCOUNT SIZE
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {accountSizes.map((size) => (
            <div key={size.value} className="relative">
              {size.popular && (
                <div className="absolute -top-2 left-0 right-0 mx-auto w-fit rounded bg-primary px-1 py-0.5 text-center text-xs font-bold uppercase text-primary-foreground">
                  Most Popular
                </div>
              )}
              <button
                type="button"
                className={cn(
                  "flex h-16 w-full flex-col items-center justify-center rounded-md border border-border bg-secondary/50 transition-all hover:border-primary/50",
                  selectedAccountSize === size.value &&
                    "border-2 border-primary",
                  size.popular && "border-primary/30"
                )}
                onClick={() => handleSelectAccountSize(size.value)}
              >
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{size.label}</span>
              </button>
            </div>
          ))}
        </div>
        {errors.accountSize && (
          <FormError message={errors.accountSize.message} />
        )}
      </div>

      {!isPropFirmSelected && (
        <>
          <div className="space-y-3">
            <Label className="text-sm uppercase text-muted-foreground">
              Experience Level
            </Label>
            <RadioGroup
              onValueChange={(value) =>
                handleSelectExperience(
                  value as OnboardingFormValues["experienceLevel"]
                )
              }
              value={selectedExperience}
              className="space-y-2"
            >
              {experienceLevels.map((level) => (
                <div
                  key={level.value}
                  className={cn(
                    "flex items-center rounded-md border border-border bg-secondary/50 p-3 transition-all",
                    selectedExperience === level.value && "border-primary"
                  )}
                >
                  <RadioGroupItem
                    value={level.value}
                    id={level.value}
                    className="border-muted text-primary"
                  />
                  <Label htmlFor={level.value} className="ml-2 cursor-pointer">
                    {level.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-sm uppercase text-muted-foreground">
              Biggest Challenge
            </Label>
            <div className="grid gap-2">
              {challenges.map((challenge) => (
                <div
                  key={challenge.value}
                  className={cn(
                    "flex items-center rounded-md border border-border bg-secondary/50 p-3 transition-all",
                    selectedChallenges.includes(
                      challenge.value as OnboardingFormValues["biggestChallenge"][number]
                    ) && "border-primary"
                  )}
                >
                  <Checkbox
                    id={challenge.value}
                    checked={selectedChallenges.includes(
                      challenge.value as OnboardingFormValues["biggestChallenge"][number]
                    )}
                    onCheckedChange={() =>
                      handleToggleChallenge(
                        challenge.value as OnboardingFormValues["biggestChallenge"][number]
                      )
                    }
                    className="border-muted text-primary"
                  />
                  <Label
                    htmlFor={challenge.value}
                    className="ml-2 cursor-pointer"
                  >
                    {challenge.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="space-y-3">
        <Label
          htmlFor="accountName"
          className="text-sm uppercase text-muted-foreground"
        >
          Account Name
        </Label>
        <Input
          id="accountName"
          placeholder={
            isPropFirmSelected ? "My FTMO Challenge" : "My Trading Account"
          }
          {...register("accountName")}
          className={cn(
            "rounded-md border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
            errors.accountName &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {errors.accountName && (
          <FormError message={errors.accountName.message} />
        )}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="broker"
          className="text-sm uppercase text-muted-foreground"
        >
          Broker
        </Label>
        <Input
          id="broker"
          placeholder={isPropFirmSelected ? "e.g., FTMO" : "e.g., IC Markets"}
          {...register("broker")}
          className={cn(
            "rounded-md border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
            errors.broker &&
              "border-red-500 focus:border-red-500 focus:ring-red-500"
          )}
        />
        {errors.broker && <FormError message={errors.broker.message} />}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="accountCurrency"
          className="text-sm uppercase text-muted-foreground"
        >
          Currency
        </Label>
        <Select
          onValueChange={(value) =>
            setValue("accountCurrency", value, { shouldValidate: true })
          }
          defaultValue="USD"
        >
          <SelectTrigger
            className={cn(
              "rounded-md border-border bg-secondary/50 text-foreground focus:border-primary focus:ring-primary",
              errors.accountCurrency &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          >
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent className="rounded-md border-border bg-card text-foreground">
            {currencies.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accountCurrency && (
          <FormError message={errors.accountCurrency.message} />
        )}
      </div>

      <input type="hidden" {...register("propFirm")} />
      <input type="hidden" {...register("accountSize")} />
      <input type="hidden" {...register("experienceLevel")} />
      <input type="hidden" {...register("biggestChallenge")} />
    </div>
  );
}
