"use client";

import { useId } from "react";
import { Area, AreaChart, Rectangle, CartesianGrid } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { CustomTooltipContent } from "./chart-extra";
import { Badge } from "@/components/ui/badge";
// Subscriber data for the last 12 months
const chartData = [
  { month: "Jan 2025", actual: 5000 },
  { month: "Feb 2025", actual: 10000 },
  { month: "Mar 2025", actual: 15000 },
  { month: "Apr 2025", actual: 22000 },
  { month: "May 2025", actual: 20000 },
  { month: "Jun 2025", actual: 35000 },
  { month: "Jul 2025", actual: 30000 },
  { month: "Aug 2025", actual: 60000 },
  { month: "Sep 2025", actual: 65000 },
  { month: "Oct 2025", actual: 60000 },
  { month: "Nov 2025", actual: 70000 },
  { month: "Dec 2025", actual: 78000 },
];

const chartConfig = {
  actual: {
    label: "Actual",
    color: "hsl(var(--chart-6))",
  },
  projected: {
    label: "Projected",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface CustomCursorProps {
  fill?: string;
  pointerEvents?: string;
  height?: number;
  points?: Array<{ x: number; y: number }>;
}

function CustomCursor(props: CustomCursorProps) {
  const { fill, pointerEvents, height, points } = props;

  if (!points || points.length === 0) {
    return null;
  }

  const { x, y } = points[0]!;
  return (
    <>
      <Rectangle
        x={x - 12}
        y={y}
        fill={fill}
        pointerEvents={pointerEvents}
        width={24}
        height={height}
        className="recharts-tooltip-cursor fill-chart-6/10"
        type="linear"
      />
      <Rectangle
        x={x - 1}
        y={y}
        fill={fill}
        pointerEvents={pointerEvents}
        width={2}
        height={height}
        className="recharts-tooltip-inner-cursor bg-background"
        type="linear"
      />
    </>
  );
}

export function PerformanceChart() {
  const id = useId();

  return (
    <Card className="gap-0 bg-transparent">
      <CardHeader className="pb-0 mb-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <CardTitle className="uppercase text-muted-foreground font-medium tracking-widest text-xs">
              EUR/USD
            </CardTitle>
            <div className="flex items-start gap-2">
              <div className="font-semibold text-2xl">142,869</div>
              <Badge className="mt-1.5 bg-primary/24 text-primary border-none">
                +24.7%
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
            data={chartData}
            margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="var(--border)"
              opacity={0.5}
            />
            <defs>
              <linearGradient id={`${id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-6))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-6))"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient
                id={`${id}-gradient-2`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--chart-2))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    actual: "hsl(var(--chart-6))",
                    projected: "hsl(var(--chart-2))",
                  }}
                  labelMap={{
                    actual: "Actual",
                    projected: "Projected",
                  }}
                  dataKeys={["actual", "projected"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              }
              cursor={<CustomCursor fill="hsl(var(--chart-6))" />}
            />

            <Area
              type="monotone"
              dataKey="actual"
              stroke="hsl(var(--chart-6))"
              strokeWidth={2}
              fill={`url(#${id}-gradient)`}
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// --primary: oklch(0.596 0.145 163.225);
// --primary: oklch(0.596 0.145 163.225);
