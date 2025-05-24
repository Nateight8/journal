"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { SymbolAnalytic } from "@/graphql/trade-analytics";

const chartConfig = {
  pnl: {
    label: "P&L",
    color: "hsl(var(--chart-1))",
  },
  zeroLine: {
    label: "Break Even",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function SymbolAnalyticsChart({ data }: { data: SymbolAnalytic }) {
  const id = useId();

  // Sort performance data by time
  const sortedPerformance = [...data.performance].sort(
    (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Transform performance data for the chart
  const performanceData = sortedPerformance.map((perf, index) => {
    const date = new Date(perf.time);
    return {
      time: date,
      timeLabel: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      pnl: perf.pnl,
      // Add cumulative pnl for area chart
      cumulativePnl: sortedPerformance
        .slice(0, index + 1)
        .reduce((sum, p) => sum + p.pnl, 0),
    };
  });

  // Calculate metrics
  const totalPnl =
    performanceData.length > 0
      ? performanceData[performanceData.length - 1].cumulativePnl
      : 0;

  const percentageChange =
    performanceData.length > 1
      ? ((performanceData[performanceData.length - 1].pnl -
          performanceData[0].pnl) /
          Math.abs(performanceData[0].pnl || 1)) *
        100
      : 0;

  // Determine chart colors based on P&L
  const chartColor =
    totalPnl >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--destructive))";
  const gradientId = `gradient-${id}`;

  return (
    <Card className="gap-0 bg-transparent">
      <CardHeader className="pb-0 mb-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="uppercase text-muted-foreground font-medium tracking-widest text-xs">
              {data.symbol || "N/A"}
            </CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">
                {totalPnl.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <Badge
                className={`mt-1.5 ${
                  percentageChange >= 0
                    ? "bg-green-500/20 text-green-500"
                    : "bg-red-500/20 text-red-500"
                } border-none`}
              >
                {percentageChange >= 0 ? "+" : ""}
                {percentageChange.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-36 w-full [&_.recharts-tooltip-cursor]:fill-chart-6/15 [&_.recharts-tooltip-inner-cursor]:bg-background [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50"
        >
          <AreaChart
            accessibilityLayer
            data={performanceData}
            margin={{ left: 0, right: 0, top: 8, bottom: 8 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="hsl(var(--border))"
              opacity={0.5}
            />
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            {/* Zero line */}
            <CartesianGrid
              horizontal
              vertical={false}
              strokeDasharray="3 3"
              stroke="hsl(var(--muted-foreground))"
              opacity={0.3}
            />
            {/* P&L Area */}
            <Area
              type="monotone"
              dataKey="cumulativePnl"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              activeDot={{
                r: 4,
                strokeWidth: 2,
                fill: "hsl(var(--background))",
                stroke: chartColor,
              }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload || payload.length === 0) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="text-sm text-muted-foreground">
                      {data.timeLabel}
                    </p>
                    <p className="font-medium">
                      P&L:{" "}
                      <span
                        className={
                          data.pnl >= 0 ? "text-green-500" : "text-red-500"
                        }
                      >
                        {data.pnl >= 0 ? "+" : ""}
                        {data.pnl.toFixed(2)}
                      </span>
                    </p>
                    <p className="text-sm">
                      Cumulative:{" "}
                      <span
                        className={
                          data.cumulativePnl >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {data.cumulativePnl >= 0 ? "+" : ""}
                        {data.cumulativePnl.toFixed(2)}
                      </span>
                    </p>
                  </div>
                );
              }}
              cursor={{
                stroke: "hsl(var(--muted-foreground))",
                strokeWidth: 1,
                strokeDasharray: "3 3",
                strokeOpacity: 0.5,
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// --primary: oklch(0.596 0.145 163.225);
// --primary: oklch(0.596 0.145 163.225);
