"use client";

import * as React from "react";
import { AlertTriangle, Shield } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { SafetyFormData } from "./safety-net";

interface SafetyProps {
  form: UseFormReturn<SafetyFormData>;
  isPropChallenge: boolean;
  accountSize: number;
}

export default function Safety({
  form,
  isPropChallenge,
  accountSize,
}: SafetyProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  // Use the goal to determine if it's a prop firm challenge
  //   const propFirmChallenge = tradingAccount?.goal === "PROP";
  //   const accountSize = tradingAccount?.size || 10000;
  const maxDailyRisk = watch("maxDailyRisk");
  const maxDailyDrawdown = watch("maxDailyDrawdown");
  const maxTotalDrawdown = watch("maxTotalDrawdown");
  const riskPerTrade = watch("riskPerTrade");
  // const maxOpenTrades = watch("maxOpenTrades");

  const dailyRiskAmount = (accountSize * maxDailyRisk) / 100;
  const dailyDrawdownAmount = (accountSize * maxDailyDrawdown) / 100;
  const totalDrawdownAmount = (accountSize * maxTotalDrawdown) / 100;
  const riskPerTradeAmount = (accountSize * riskPerTrade) / 100;

  const getRiskColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return "text-green-500";
    if (value <= thresholds[1]) return "text-amber-400";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Your Trading Safety Net</h3>
        <p className="text-sm text-muted-foreground">
          Set up risk parameters to protect your capital
        </p>
      </div>

      <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-primary">Risk Management</h4>
        </div>
        <p className="mt-2 text-sm text-primary/80">
          Proper risk management is the foundation of successful trading. These
          settings will help protect your account.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm uppercase text-muted-foreground">
              Daily Risk Limit
            </Label>
            <span
              className={cn(
                "text-sm font-medium",
                getRiskColor(maxDailyRisk, [2, 5])
              )}
            >
              {maxDailyRisk}% (${dailyRiskAmount.toFixed(0)})
            </span>
          </div>
          <Slider
            value={[maxDailyRisk]}
            min={0.5}
            max={10}
            step={0.5}
            onValueChange={(value) =>
              setValue("maxDailyRisk", value[0], { shouldValidate: true })
            }
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-500">Safe (0.5-2%)</span>
            <span className="text-amber-400">Moderate (2-5%)</span>
            <span className="text-red-500">Aggressive (5%+)</span>
          </div>
          {errors.maxDailyRisk && (
            <p className="text-sm text-red-500">
              {errors.maxDailyRisk.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm uppercase text-muted-foreground">
              Daily Drawdown Limit
            </Label>
            <span
              className={cn(
                "text-sm font-medium",
                getRiskColor(maxDailyDrawdown, [3, 7])
              )}
            >
              {maxDailyDrawdown}% (${dailyDrawdownAmount.toFixed(0)})
            </span>
          </div>
          <Slider
            value={[maxDailyDrawdown]}
            min={0.5}
            max={15}
            step={0.5}
            onValueChange={(value) =>
              setValue("maxDailyDrawdown", value[0], { shouldValidate: true })
            }
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-500">Strict (0.5-3%)</span>
            <span className="text-amber-400">Standard (3-7%)</span>
            <span className="text-red-500">Flexible (7%+)</span>
          </div>
          {errors.maxDailyDrawdown && (
            <p className="text-sm text-red-500">
              {errors.maxDailyDrawdown.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm uppercase text-muted-foreground">
              Maximum Total Drawdown
            </Label>
            <span
              className={cn(
                "text-sm font-medium",
                getRiskColor(maxTotalDrawdown, [5, 10])
              )}
            >
              {maxTotalDrawdown}% (${totalDrawdownAmount.toFixed(0)})
            </span>
          </div>
          <Slider
            value={[maxTotalDrawdown]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) =>
              setValue("maxTotalDrawdown", value[0], { shouldValidate: true })
            }
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-500">Strict (1-5%)</span>
            <span className="text-amber-400">Standard (5-10%)</span>
            <span className="text-red-500">Flexible (10%+)</span>
          </div>
          {errors.maxTotalDrawdown && (
            <p className="text-sm text-red-500">
              {errors.maxTotalDrawdown.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm uppercase text-muted-foreground">
              Risk Per Trade
            </Label>
            <span
              className={cn(
                "text-sm font-medium",
                getRiskColor(riskPerTrade, [1, 2])
              )}
            >
              {riskPerTrade}% (${riskPerTradeAmount.toFixed(0)})
            </span>
          </div>
          <Slider
            value={[riskPerTrade]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={(value) =>
              setValue("riskPerTrade", value[0], { shouldValidate: true })
            }
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="text-green-500">Conservative (0.1-1%)</span>
            <span className="text-amber-400">Balanced (1-2%)</span>
            <span className="text-red-500">Risky (2%+)</span>
          </div>
          {errors.riskPerTrade && (
            <p className="text-sm text-red-500">
              {errors.riskPerTrade.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label className="text-sm uppercase text-muted-foreground">
            Maximum Open Trades
          </Label>
          <Input
            type="number"
            min={1}
            max={20}
            {...register("maxOpenTrades", { valueAsNumber: true })}
            className={cn(
              "rounded-md border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary",
              errors.maxOpenTrades &&
                "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
          />
          <p className="text-xs text-muted-foreground">
            Limit the number of trades you can have open at once to manage risk
            exposure
          </p>
          {errors.maxOpenTrades && (
            <p className="text-sm text-red-500">
              {errors.maxOpenTrades.message}
            </p>
          )}
        </div>
      </div>

      {isPropChallenge && (
        <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h4 className="text-sm font-medium text-primary">
              Prop Firm Rules
            </h4>
          </div>
          <p className="mt-2 text-xs text-primary/80">
            These settings are aligned with standard prop firm rules. Adjust if
            your specific challenge has different requirements.
          </p>
        </div>
      )}
    </div>
  );
}

// const { data: tradingAccountData } = useQuery(
//     accountOperations.Querries.tradingAccount,
//     {
//       variables: {},
//     }
//   );
