"use client";

import { useFormContext } from "react-hook-form";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  LineChart,
  Shield,
} from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { OnboardingFormValues } from "../onboard";

export function CommandCenterPreview() {
  const { watch } = useFormContext<OnboardingFormValues>();

  const accountName = watch("accountName");
  const accountSize = Number.parseInt(watch("accountSize") || "10000");
  const maxDailyRisk = watch("maxDailyRisk");
  const maxDailyDrawdown = watch("maxDailyDrawdown");
  const maxTotalDrawdown = watch("maxTotalDrawdown");
  const riskPerTrade = watch("riskPerTrade");
  const tradingStyle = watch("tradingStyle");
  const tradingSessions = watch("tradingSessions") || [];
  const riskRewardRatio = watch("riskRewardRatio");
  const maxOpenTrades = watch("maxOpenTrades");

  const dailyRiskAmount = (accountSize * maxDailyRisk) / 100;
  const dailyDrawdownAmount = (accountSize * maxDailyDrawdown) / 100;
  const totalDrawdownAmount = (accountSize * maxTotalDrawdown) / 100;
  const riskPerTradeAmount = (accountSize * riskPerTrade) / 100;

  const tradingStyleNames = {
    scalping: "Scalping (The Sprinter)",
    dayTrading: "Day Trading (The Day Warrior)",
    swingTrading: "Swing Trading (The Patient Hunter)",
    positionTrading: "Position Trading (The Marathon Runner)",
  };

  const sessionNames = {
    asian: "Asian",
    london: "London",
    newYork: "New York",
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Your Trading Command Center</h3>
        <p className="text-sm text-muted-foreground">
          Here's a preview of your personalized dashboard
        </p>
      </div>

      <div className="rounded-md border border-border bg-secondary/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="font-medium">{accountName || "My Trading Account"}</h4>
          <span className="rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
            ${accountSize.toLocaleString()}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {tradingStyleNames[tradingStyle || "dayTrading"]}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-secondary/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm uppercase text-muted-foreground">
              Daily Risk Limit
            </div>
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold">
              ${dailyRiskAmount.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">
              {maxDailyRisk}% of account
            </div>
          </div>
          <Progress value={30} className="mt-2 h-1.5 bg-muted" />
          <div className="mt-1 text-xs text-muted-foreground">
            $0 used today
          </div>
        </div>

        <div className="rounded-md border border-border bg-secondary/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm uppercase text-muted-foreground">
              Max Drawdown
            </div>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-end justify-between">
            <div className="text-2xl font-bold">
              ${totalDrawdownAmount.toFixed(0)}
            </div>
            <div className="text-sm text-muted-foreground">
              {maxTotalDrawdown}% of account
            </div>
          </div>
          <Progress value={10} className="mt-2 h-1.5 bg-muted" />
          <div className="mt-1 text-xs text-muted-foreground">$0 drawdown</div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-secondary/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm uppercase text-muted-foreground">
            Risk Parameters
          </div>
          <Shield className="h-4 w-4 text-primary" />
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Risk Per Trade</span>
            </div>
            <span className="font-medium text-primary">
              ${riskPerTradeAmount.toFixed(0)} ({riskPerTrade}%)
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Risk:Reward Ratio</span>
            </div>
            <span className="font-medium text-primary">{riskRewardRatio}</span>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Daily Drawdown Limit</span>
            </div>
            <span className="font-medium text-primary">
              {maxDailyDrawdown}% (${dailyDrawdownAmount.toFixed(0)})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Max Open Trades</span>
            </div>
            <span className="font-medium text-primary">{maxOpenTrades}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Trading Sessions</span>
            </div>
            <span className="font-medium text-primary">
              {tradingSessions
                .map(
                  (session) =>
                    sessionNames[session as keyof typeof sessionNames]
                )
                .join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-border bg-secondary/50 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm uppercase text-muted-foreground">
            Performance Overview
          </div>
          <LineChart className="h-4 w-4 text-primary" />
        </div>
        <div className="flex h-[100px] items-center justify-center rounded-md border border-dashed border-border p-4">
          <div className="text-center text-sm text-muted-foreground">
            <Calendar className="mx-auto h-6 w-6 text-muted" />
            <p className="mt-2">
              Log your first trade to see performance metrics
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h4 className="font-medium text-green-500">You're All Set!</h4>
        </div>
        <p className="mt-2 text-sm text-green-500/80">
          Your trading command center is ready. Start logging trades to track
          your performance and maintain trading discipline.
        </p>
      </div>
    </div>
  );
}
