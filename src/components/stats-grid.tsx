import type React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Info } from "lucide-react";

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
    <div className="relative p-4 lg:p-5 group before:absolute before:inset-y-8 before:right-0 before:w-px before:bg-gradient-to-b before:from-border/30 before:via-border before:to-border/30 last:before:hidden">
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
          <div className="text-xs text-muted-foreground/60">
            <span className={cn("font-medium", trendColor)}>
              {isPositive ? "↗" : "↘"} {change.value}
            </span>{" "}
            vs last period
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: StatsCardProps[];
  tooltip: string;
}

export function TradingStatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 min-[1200px]:grid-cols-4 border border-border rounded-xl bg-transparent">
      {stats.map((stat) => (
        <StatsCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
