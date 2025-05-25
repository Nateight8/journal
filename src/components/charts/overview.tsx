"use client";

import type React from "react";

import { useId, useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TradingStatsGrid } from "../stats-grid";
import { PortfolioOverview } from "@/graphql/dashboard-operations";
import { BarChart3 } from "lucide-react";

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

  const [selectedValue, setSelectedValue] = useState("1D");
  const selectedIndex = TIME_PERIOD_OPTIONS.indexOf(selectedValue);

  // const isPositive = data && data?.pnl.value >= 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between w-full ">
        <div className="flex-1">
          <h4 className="font-medium text-foreground mb-4 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Latest Stats
          </h4>
        </div>
        <div className="flex flex-1 w-full justify-end">
          <div className="bg-muted pb-4 dark:bg-background/50 inline-flex h-8 rounded-full p-1 shrink-0">
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
      {/* TODO: ADD POTFOLIO VALUE */}
      <TradingStatsGrid stats={data?.overviewStats} />
    </div>
  );
}
