"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type PerformanceProps = {
  data: {
    winRate: number;
    averageRR: number;
    tradeFrequency: number;
    plConsistency: number;
    holdingTime: number;
    executionQuality: number;
    emotionalControl: number;
    monthlyChange: number;
    period: string;
  };
};

const chartConfig = {
  value: {
    label: "Score",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function Performance({ data }: PerformanceProps) {
  const chartData = [
    { metric: "Win Rate", value: data.winRate },
    { metric: "Average R:R", value: data.averageRR },
    { metric: "Trade Frequency", value: data.tradeFrequency },
    { metric: "P&L Consistency", value: data.plConsistency },
    { metric: "Holding Time", value: data.holdingTime },
    { metric: "Execution Quality", value: data.executionQuality },
    { metric: "Emotional Control", value: data.emotionalControl },
  ];

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Trading Performance</CardTitle>
        <CardDescription>Performance metrics overview</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid gridType="circle" radialLines={false} />
            <PolarAngleAxis dataKey="metric" />
            <Radar
              dataKey="value"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by {data.monthlyChange}% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          {data.period}
        </div>
      </CardFooter>
    </Card>
  );
}
