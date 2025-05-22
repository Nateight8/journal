"use client";

import { DollarSign } from "lucide-react";

import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
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
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { OnboardingFormValues } from "./account-setuo";

type AccountSize = {
  value: number;
  label: string;
  popular?: boolean;
};

export function AccountProfile({
  form,
}: {
  form: UseFormReturn<OnboardingFormValues>;
}) {
  const goal = form.watch("goal");
  const isPropFirmSelected = goal === "PROP";

  console.log("FORM", form.watch("goal"));
  const { control } = form;

  const propFirms = [
    { id: "ftmo" as const, name: "FTMO", logo: "FTMO" },
    { id: "trueForex" as const, name: "TRUE FOREX", logo: "TF" },
    { id: "fundedNext" as const, name: "FUNDED NEXT", logo: "FN" },
    { id: "theFundedTrader" as const, name: "THE FUNDED TRADER", logo: "TFT" },
  ] as const;

  const accountSizes: AccountSize[] = [
    { value: 5000, label: "$5K" },
    { value: 10000, label: "$10K", popular: true },
    { value: 25000, label: "$25K" },
    { value: 50000, label: "$50K" },
    { value: 100000, label: "$100K" },
    { value: 200000, label: "$200K" },
  ] as const;

  const experienceLevels = [
    { value: "BEGINNER", label: "BEGINNER (< 1 YEAR)" },
    { value: "INTERMEDIATE", label: "INTERMEDIATE (1-2 YEARS)" },
    { value: "ADVANCED", label: "ADVANCED (3+ YEARS)" },
  ] as const;

  const challenges = [
    { value: "RISK_MANAGEMENT", label: "RISK MANAGEMENT" },
    { value: "CONSISTENCY", label: "CONSISTENCY" },
    { value: "PSYCHOLOGY", label: "PSYCHOLOGY" },
    { value: "PATIENCE", label: "PATIENCE" },
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Your Trading Identity</h3>
        <p className="text-sm text-muted-foreground">
          Tell us about your trading journey
        </p>
      </div>

      {isPropFirmSelected && (
        <FormField
          control={control}
          name="propFirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm uppercase text-muted-foreground">
                SELECT — PROP FIRM
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 gap-3">
                  {propFirms.map((firm) => (
                    <button
                      key={firm.id}
                      type="button"
                      className={cn(
                        "flex flex-col items-center rounded-md border border-border bg-secondary/50 p-4 transition-all hover:border-primary/50",
                        field.value === firm.id && "border-2 border-primary"
                      )}
                      onClick={() => field.onChange(firm.id)}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary font-bold text-primary">
                        {firm.logo}
                      </div>
                      <span className="mt-2 text-sm font-medium">
                        {firm.name}
                      </span>
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={control}
        name="accountSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm uppercase text-muted-foreground">
              SELECT — ACCOUNT SIZE
            </FormLabel>
            <FormControl>
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
                        field.value === size.value && "border-2 border-primary",
                        size.popular && "border-primary/30"
                      )}
                      onClick={() => field.onChange(size.value)}
                    >
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{size.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isPropFirmSelected && (
        <>
          <FormField
            control={control}
            name="experienceLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm uppercase text-muted-foreground">
                  Experience Level
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="space-y-2"
                  >
                    {experienceLevels.map((level) => (
                      <div
                        key={level.value}
                        className={cn(
                          "flex items-center rounded-md border border-border bg-secondary/50 p-3 transition-all",
                          field.value === level.value && "border-primary"
                        )}
                      >
                        <RadioGroupItem
                          value={level.value}
                          id={level.value}
                          className="border-muted text-primary"
                        />
                        <Label
                          htmlFor={level.value}
                          className="ml-2 cursor-pointer"
                        >
                          {level.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="biggestChallenge"
            render={({ field: { value = [], onChange } }) => (
              <FormItem>
                <FormLabel className="text-sm uppercase text-muted-foreground">
                  Biggest Challenge
                </FormLabel>
                <FormControl>
                  <div className="grid gap-2">
                    {challenges.map((challenge) => (
                      <div
                        key={challenge.value}
                        className={cn(
                          "flex items-center rounded-md border border-border bg-secondary/50 p-3 transition-all",
                          value.includes(challenge.value) && "border-primary"
                        )}
                      >
                        <Checkbox
                          id={challenge.value}
                          checked={value.includes(challenge.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              onChange([...value, challenge.value]);
                            } else {
                              onChange(
                                value.filter(
                                  (v: string) => v !== challenge.value
                                )
                              );
                            }
                          }}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      <FormField
        control={control}
        name="accountName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm uppercase text-muted-foreground">
              Account Name
            </FormLabel>
            <FormControl>
              <Input
                placeholder={
                  isPropFirmSelected
                    ? "My FTMO Challenge"
                    : "My Trading Account"
                }
                {...field}
                className="rounded-md border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="broker"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm uppercase text-muted-foreground">
              Broker
            </FormLabel>
            <FormControl>
              <Input
                placeholder={
                  isPropFirmSelected ? "e.g., FTMO" : "e.g., IC Markets"
                }
                {...field}
                className="rounded-md border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="accountCurrency"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm uppercase text-muted-foreground">
              Currency
            </FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || "USD"}
              >
                <SelectTrigger className="rounded-md border-border bg-secondary/50 text-foreground focus:border-primary focus:ring-primary">
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
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
