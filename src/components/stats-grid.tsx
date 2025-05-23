import type React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { OverviewStats } from "@/graphql/dashboard-operations";
import {
  BarChart2,
  TrendingDown,
  Info,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
  };
  icon: React.ReactNode;
  tooltip: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  tooltip,
}: StatsCardProps) {
  const isPositive = change.trend === "up";
  const trendColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="relative p-4 lg:p-5 group hover:bg-muted/20 border-r border-border last:border-r-0">
      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <div className="max-[480px]:hidden size-10 shrink-0 rounded-full bg-muted border border-border flex items-center justify-center text-primary">
          {icon}
        </div>
        {/* Content */}
        <div>
          <div className="font-medium tracking-widest text-xs uppercase text-muted-foreground/60 flex items-center gap-1">
            {title}
            {tooltip && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help">
                      <Info size={12} className="text-muted-foreground/60" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    {tooltip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div className="text-2xl font-semibold mb-2">
            <span key={value}>{value}</span>
          </div>
          {change.value && (
            <div className="text-xs text-muted-foreground/60">
              <span className={cn("font-medium", trendColor)}>
                {isPositive ? "↗" : "↘"} {change.value}
              </span>{" "}
              vs last period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function TradingStatsGrid({ stats }: { stats?: OverviewStats }) {
  const winRateIsPositive = stats?.winRate.value || 0 >= 0;
  const profitFactorIsPositive = stats?.profitFactor.value || 0 >= 0;
  const avgReturnIsPositive = stats?.avgReturn.value || 0 >= 0;
  const maxDrawdownIsPositive = stats?.maxDrawdown.value || 0 >= 0;
  // const riskRewardIsPositive = stats?.riskReward.value >= 0;
  console.log("stats from grid", stats);

  return (
    <Carousel className="w-full  ">
      <CarouselContent className="-ml-1 bg-transparent space-x-4 p-2">
        <CarouselItem className="pl-1 basis-[80%] border rounded-lg md:basis-[25%] lg:basis-1/3">
          <StatsCard
            title="Win Rate"
            value={stats?.winRate.value?.toString() || "0"}
            change={{
              value: stats?.winRate.percentage?.toString() || "0",
              trend: winRateIsPositive ? "up" : "down",
            }}
            icon={<BarChart2 />}
            tooltip="The percentage of trades that result in a profit. Higher is better."
          />
        </CarouselItem>
        <CarouselItem className="pl-1 basis-[80%] border rounded-lg md:basis-[25%] lg:basis-1/3">
          <StatsCard
            title="Profit Factor"
            value={stats?.profitFactor.value?.toString() || "0"}
            change={{
              value: stats?.profitFactor.percentage?.toString() || "0",
              trend: profitFactorIsPositive ? "up" : "down",
            }}
            icon={<Activity />}
            tooltip="The ratio of gross profits to gross losses. A value above 1 indicates profitability."
          />
        </CarouselItem>
        <CarouselItem className="pl-1 basis-[80%] border rounded-lg md:basis-[25%] lg:basis-1/3">
          <StatsCard
            title="Average Return"
            value={stats?.avgReturn.value?.toString() || "0"}
            change={{
              value: stats?.avgReturn.percentage?.toString() || "0",
              trend: avgReturnIsPositive ? "up" : "down",
            }}
            icon={<DollarSign />}
            tooltip="The average profit per winning trade. Higher values indicate more profitable trades."
          />
        </CarouselItem>
        <CarouselItem className="pl-1 basis-[80%] border rounded-lg md:basis-[25%] lg:basis-1/3">
          <StatsCard
            title="Max Drawdown"
            value={stats?.maxDrawdown.value?.toString() || "0"}
            change={{
              value: stats?.maxDrawdown.percentage?.toString() || "0",
              trend: maxDrawdownIsPositive ? "up" : "down",
            }}
            icon={maxDrawdownIsPositive ? <TrendingUp /> : <TrendingDown />}
            tooltip="The largest peak-to-trough decline in portfolio value. Lower is better."
          />
        </CarouselItem>
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
