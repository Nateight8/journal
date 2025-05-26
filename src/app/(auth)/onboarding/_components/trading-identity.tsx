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

interface OnboardingFormValues {
  isPropFirmSelected: boolean;
  selectedPropFirm: string;
  selectedAccountSize: string;
  tradingExperience: string;
  biggestChallenge: string[];
  accountName: string;
  broker: string;
  accountSize: string;
  accountCurrency: string;
  propFirm: string;
  experienceLevel: string;
}

type AccountSize = {
  value: number;
  label: string;
  popular?: boolean;
};

const FormError = ({ message }: { message: string }) => (
  <p className="text-sm font-medium text-destructive">{message}</p>
);

export function TradingIdentity() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext<OnboardingFormValues>();
  const isPropFirmSelected = watch("isPropFirmSelected") ?? false;
  const selectedPropFirm = watch("selectedPropFirm") ?? "";
  const selectedAccountSize = watch("selectedAccountSize") ?? "";
  const tradingExperience = watch("tradingExperience") ?? "";
  const biggestChallenge = watch("biggestChallenge") ?? [];
  const accountCurrency = watch("accountCurrency") ?? "";

  const handleSelectPropFirm = (firm: string) => {
    setValue("selectedPropFirm", firm);
    setValue("isPropFirmSelected", true);
    setValue("propFirm", firm);
  };

  const handleSelectAccountSize = (size: string) => {
    setValue("selectedAccountSize", size);
    setValue("accountSize", size);
  };

  const handleSelectExperience = (experience: string) => {
    setValue("tradingExperience", experience);
    setValue("experienceLevel", experience);
  };

  const handleToggleChallenge = (challenge: string) => {
    const currentChallenges = biggestChallenge;
    const newChallenges = currentChallenges.includes(challenge)
      ? currentChallenges.filter((c) => c !== challenge)
      : [...currentChallenges, challenge];
    setValue("biggestChallenge", newChallenges);
  };

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
                  selectedAccountSize === size.value.toString() &&
                    "border-2 border-primary",
                  size.popular && "border-primary/30"
                )}
                onClick={() => handleSelectAccountSize(size.value.toString())}
              >
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{size.label}</span>
              </button>
            </div>
          ))}
        </div>
        {errors.accountSize && (
          <FormError
            message={errors.accountSize?.message ?? "Account size is required"}
          />
        )}
      </div>

      {!isPropFirmSelected && (
        <>
          <div className="space-y-3">
            <Label className="text-sm uppercase text-muted-foreground">
              Experience Level
            </Label>
            <RadioGroup
              value={tradingExperience}
              onValueChange={handleSelectExperience}
              className="space-y-2"
            >
              {experienceLevels.map((level) => (
                <div
                  key={level.value}
                  className={cn(
                    "flex items-center rounded-md border border-border bg-secondary/50 p-3 transition-all",
                    tradingExperience === level.value && "border-primary"
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
                    biggestChallenge.includes(
                      challenge.value as OnboardingFormValues["biggestChallenge"][number]
                    ) && "border-primary"
                  )}
                >
                  <Checkbox
                    id={challenge.value}
                    checked={biggestChallenge.includes(
                      challenge.value as OnboardingFormValues["biggestChallenge"][number]
                    )}
                    onCheckedChange={() =>
                      handleToggleChallenge(challenge.value)
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

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountName">Account Name</Label>
          <Input
            id="accountName"
            {...register("accountName")}
            placeholder={
              isPropFirmSelected ? "My FTMO Challenge" : "My Trading Account"
            }
          />
          {errors.accountName && (
            <FormError
              message={
                errors.accountName?.message ?? "Account name is required"
              }
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="broker">Broker</Label>
          <Input
            id="broker"
            {...register("broker")}
            placeholder={isPropFirmSelected ? "e.g., FTMO" : "e.g., IC Markets"}
          />
          {errors.broker && (
            <FormError
              message={errors.broker?.message ?? "Broker is required"}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountCurrency">Account Currency</Label>
          <Select
            value={accountCurrency}
            onValueChange={(value) => setValue("accountCurrency", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
          {errors.accountCurrency && (
            <FormError
              message={
                errors.accountCurrency?.message ?? "Currency is required"
              }
            />
          )}
        </div>
      </div>

      <input type="hidden" {...register("propFirm")} />
      <input type="hidden" {...register("experienceLevel")} />
      <input type="hidden" {...register("biggestChallenge")} />
    </div>
  );
}
