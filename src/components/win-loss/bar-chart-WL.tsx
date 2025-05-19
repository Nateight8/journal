"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { type: "Total Trades", value: 200, fill: "hsl(var(--chart-5))" },
  { type: "Wins", value: 80, fill: "hsl(var(--chart-1))" },
  { type: "Losses", value: 120, fill: "hsl(var(--chart-2))" },
  { type: "Risks", value: 100, fill: "hsl(var(--chart-3))" },
  { type: "Rewards", value: 220, fill: "hsl(var(--chart-4))" },
];

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function BarChartWL() {
  return (
    <div className="flex flex-col">
      <div>
        <ChartContainer config={chartConfig} className="mx-auto max-h-[350px]">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="value" layout="vertical" radius={4}>
              <LabelList
                dataKey="type"
                position="insideLeft"
                offset={8}
                className="fill-background font-medium"
                fontSize={12}
              />
              <LabelList
                dataKey="value"
                position="insideRight"
                offset={8}
                className="fill-background font-medium"
                fontSize={12}
                formatter={(value: number) => value.toLocaleString()}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
      <div className="flex-col gap-2 text-sm flex items-center">
        <div className="flex items-center gap-2 font-medium leading-none">
          {chartData[1].value} wins, {chartData[2].value} losses{" "}
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
