"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
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

interface BarChartWLProps {
  chartData: { metric: string; value: number; fill: string }[];
}

export function BarChartWL({ chartData }: BarChartWLProps) {
  // Transform data for the bar chart
  const transformedData = chartData.map((item) => ({
    name:
      chartConfig[item.metric as keyof typeof chartConfig]?.label ||
      item.metric,
    value: item.value,
    fill: item.fill,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        data={transformedData}
        layout="vertical"
        margin={{
          left: 0,
          right: 20,
          top: 10,
          bottom: 10,
        }}
        barCategoryGap={10}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          width={100}
        />
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-background p-3 rounded-md border shadow-sm">
                  <div className="font-medium capitalize">{data.name}</div>
                  <div className="text-muted-foreground">{data.value - 1}</div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
