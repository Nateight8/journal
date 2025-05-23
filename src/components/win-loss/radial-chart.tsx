"use client";

import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { CardContent } from "../ui/card";

const chartConfig = {
  value: {
    label: "Value",
  },
  wins: {
    label: "Wins",
    color: "hsl(var(--chart-1))",
  },
  losses: {
    label: "Losses",
    color: "hsl(var(--chart-2))",
  },
  risk: {
    label: "Risk",
    color: "hsl(var(--chart-3))",
  },
  reward: {
    label: "Reward",
    color: "hsl(var(--chart-4))",
  },
  trades: {
    label: "Total Trades",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function RadialChart({
  chartData,
}: {
  chartData: { metric: string; value: number; fill: string }[];
}) {
  return (
    <CardContent className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
          <ChartTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background p-3 rounded-md border shadow-sm">
                    <div className="font-medium capitalize">{data.metric}</div>
                    <div className="text-muted-foreground">
                      {data.value.toLocaleString()}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <PolarGrid gridType="circle" />
          <RadialBar dataKey="value" />
        </RadialBarChart>
      </ChartContainer>
    </CardContent>
  );
}
