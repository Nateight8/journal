"use client";

import type React from "react";

import { useId, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TradingStatsGrid } from "../stats-grid";
import { PortfolioOverview } from "@/graphql/dashboard-operations";

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
  data?: PortfolioOverview;
};

export function Overview({ data }: OverviewProps) {
  const id = useId();

  const [selectedValue, setSelectedValue] = useState("1M");
  const selectedIndex = TIME_PERIOD_OPTIONS.indexOf(selectedValue);

  const isPositive = data && data?.pnl.value >= 0;

  return (
    <Card className="gap-4">
      <CardHeader>
        <div className="flex flex-col md:flex-row flex-wrap md:items-center md:justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle>Portfolio Value</CardTitle>
            <div className="font-bold text-3xl mb-1">
              <span className="text-xl text-muted-foreground">$</span>

              {data?.totalValue.toLocaleString()}
            </div>
            <div
              className={
                isPositive
                  ? "text-primary text-sm font-medium"
                  : "text-destructive text-sm font-medium"
              }
            >
              {isPositive ? "↗" : "↘"} $
              {Math.abs(data?.pnl.value || 0).toFixed(2)} (
              {isPositive ? "+" : "-"} {data?.pnl.percentage})
            </div>
          </div>
          <div className="flex w-full justify-end">
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
        </div>
      </CardHeader>
      <CardContent>
        <TradingStatsGrid stats={data?.overviewStats} />
      </CardContent>
    </Card>
  );
}

// Tooltip descriptions
// const TOOLTIPS = {

// };
