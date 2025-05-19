"use client";

import type React from "react";

import { useId, useState } from "react";
import { BarChart2, TrendingUp, DollarSign, Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TradingStatsGrid } from "../stats-grid";

const TIME_PERIOD_OPTIONS = ["1D", "1W", "1M", "3M", "1Y"];

const ViewOption = ({ id, value }: { id: string; value: string }) => {
  return (
    <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none uppercase text-foreground has-data-[state=unchecked]:text-muted-foreground">
      {value}
      <RadioGroupItem id={`${id}-${value}`} value={value} className="sr-only" />
    </label>
  );
};

type OverviewProps = {
  data: {
    totalTrades: number;
    winRate: string;
    averageRR: string;
    totalPL: number;
    monthlyPL: number;
    openTrades: number;
    bestTrade: number;
    worstTrade: number;
  };
};

export function Overview({ data }: OverviewProps) {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState("1M");
  const selectedIndex = TIME_PERIOD_OPTIONS.indexOf(selectedValue);

  // Mock data for different time periods
  const getPerformanceData = () => {
    switch (selectedValue) {
      case "1D":
        return { value: "+0.8%", trend: "up" };
      case "1W":
        return { value: "+2.3%", trend: "up" };
      case "1M":
        return { value: "+4.2%", trend: "up" };
      case "3M":
        return { value: "-1.5%", trend: "down" };
      case "1Y":
        return { value: "+12.7%", trend: "up" };
      default:
        return { value: "+4.2%", trend: "up" };
    }
  };

  const performanceData = getPerformanceData();
  const isPositive = performanceData.trend === "up";

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>Portfolio Value</CardTitle>
            <div className="font-bold text-3xl mb-1">
              <span className="text-xl text-muted-foreground">$</span>
              {data.totalPL.toLocaleString()}
            </div>
            <div
              className={
                isPositive
                  ? "text-primary text-sm font-medium"
                  : "text-destructive text-sm font-medium"
              }
            >
              {isPositive ? "↗" : "↘"} ${Math.abs(data.monthlyPL).toFixed(2)} (
              {performanceData.value})
            </div>
          </div>
          <div className="bg-muted dark:bg-background/50 inline-flex h-8 rounded-full p-1 shrink-0">
            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              className="group text-xs after:bg-background dark:after:bg-card/64 has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-[repeat(5,1fr)] items-center gap-0 font-medium after:absolute after:inset-y-0 after:w-1/5 after:rounded-full after:shadow-xs dark:after:inset-shadow-[0_1px_rgb(255_255_255/0.15)] after:transition-[translate,box-shadow] after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] [&:after]:translate-x-[calc(var(--selected-index)*100%)]"
              data-state={selectedValue}
              style={
                {
                  "--selected-index": selectedIndex,
                } as React.CSSProperties
              }
            >
              {TIME_PERIOD_OPTIONS.map((value) => (
                <ViewOption key={value} id={id} value={value} />
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TradingStatsGrid
          stats={[
            {
              title: "Win Rate",
              value: data.winRate,
              change: {
                value: "+3.2%",
                trend: "up",
              },
              icon: <TrendingUp size={20} />,
              tooltip: TOOLTIPS.winRate,
            },
            {
              title: "Avg. R:R",
              value: data.averageRR,
              change: {
                value: "+0.22",
                trend: "up",
              },
              icon: <BarChart2 size={20} />,
              tooltip: TOOLTIPS.profitFactor,
            },
            {
              title: "Open Trades",
              value: data.openTrades.toString(),
              change: {
                value: "+12%",
                trend: "up",
              },
              icon: <DollarSign size={20} />,
              tooltip: TOOLTIPS.avgReturn,
            },
            {
              title: "Total Trades",
              value: data.totalTrades.toString(),
              change: {
                value: "-2.3%",
                trend: "down",
              },
              icon: <Activity size={20} />,
              tooltip: TOOLTIPS.maxDrawdown,
            },
          ]}
          tooltip=""
        />
      </CardContent>
    </Card>
  );
}

// Tooltip descriptions
const TOOLTIPS = {
  winRate:
    "The percentage of trades that result in a profit. Higher is better.",
  profitFactor:
    "The ratio of gross profits to gross losses. A value above 1 indicates profitability.",
  avgReturn:
    "The average profit per winning trade. Higher values indicate more profitable trades.",
  maxDrawdown:
    "The largest peak-to-trough decline in portfolio value. Lower is better.",
};
