"use client";

import { TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";

type ChartDataItem = {
  name: keyof typeof chartConfig;
  value: number;
  fill: string;
};

const chartData: ChartDataItem[] = [
  { name: "total", value: 275, fill: "hsl(var(--chart-1))" },
  { name: "losses", value: 200, fill: "hsl(var(--chart-2))" },
  { name: "wins", value: 187, fill: "hsl(var(--chart-3))" },
  { name: "risks", value: 173, fill: "hsl(var(--chart-4))" },
  { name: "rewards", value: 90, fill: "hsl(var(--chart-5))" },
];

const chartConfig = {
  value: {
    label: "Value",
  },
  total: {
    label: "Total Trades",
    color: "hsl(var(--chart-1))",
  },
  losses: {
    label: "Losses",
    color: "hsl(var(--chart-2))",
  },
  wins: {
    label: "Wins",
    color: "hsl(var(--chart-3))",
  },
  risks: {
    label: "Risks",
    color: "hsl(var(--chart-4))",
  },
  rewards: {
    label: "Rewards",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function RadialChart() {
  return (
    <div className="flex flex-col">
      <div>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={30}
            outerRadius={140}
            barSize={20}
            startAngle={0}
            endAngle={360}
          >
            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ChartDataItem;
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">
                          {chartConfig[data.name].label}
                        </div>
                        <div className="text-right">
                          {data.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <PolarGrid
              gridType="circle"
              stroke="hsl(var(--border))"
              strokeDasharray="2 2"
              opacity={0.3}
            />
            <RadialBar
              dataKey="value"
              cornerRadius={5}
              background={false}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </div>
      <div className="flex-col gap-2 text-sm flex items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          {chartData[2].value} wins, {chartData[1].value} losses{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Risk/Reward: ${chartData[3].value.toLocaleString()} / $
          {chartData[4].value.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
