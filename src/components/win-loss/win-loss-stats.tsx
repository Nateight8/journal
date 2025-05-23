"use client";
import { useId, useState } from "react";
import { BarChart3, PieChart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { RadialChart } from "./radial-chart";
import { BarChartWL } from "./bar-chart-WL";
import { WinLossTradeStats } from "@/graphql/dashboard-operations";

type ChartType = "bar-chart" | "pie-chart";
const chartOptions: ChartType[] = ["pie-chart", "bar-chart"];

export default function WinLossState({
  winLossStats,
}: {
  winLossStats?: WinLossTradeStats;
}) {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState<ChartType>("bar-chart");
  const selectedIndex = chartOptions.indexOf(selectedValue);

  const {
    wins = 0,
    losses = 0,
    totalTrades = 0,
    totalRisk = 0,
    totalReward = 0,
  } = winLossStats || {};
  // const chartData = [
  //   { metric: "wins", value: 5, fill: "" },
  //   { metric: "losses", value: 2, fill: "hsl(var(--chart-2))" },
  //   { metric: "risk", value: 200, fill: "hsl(var(--chart-3))" },
  //   { metric: "reward", value: 400, fill: "hsl(var(--chart-4))" },
  //   { metric: "trades", value: 7, fill: "hsl(var(--chart-5))" },
  // ];
  // Chart data with renamed keys: metric & value
  const chartData = [
    { metric: "Risk", value: totalRisk + 1, fill: "hsl(var(--chart-1))" },
    { metric: "Reward", value: totalReward + 1, fill: "hsl(var(--chart-2))" },
    {
      metric: "Total Trades",
      value: totalTrades + 1,
      fill: "hsl(var(--chart-3))",
    },
    {
      metric: "Win Rate",
      value: wins + 1,
      fill: " hsl(var(--chart-4))",
    },
    {
      metric: "Loss Rate",
      value: losses + 1,
      fill: "hsl(var(--chart-5))",
    },
  ];

  return (
    <Card className="">
      <CardHeader className="justify-between items-center flex">
        <div className="">
          <CardTitle>PNL STATS</CardTitle>
          <CardDescription>Last 30 trading days</CardDescription>
        </div>
        <div className="bg-muted dark:bg-background/50 inline-flex h-8 rounded-full p-1 shrink-0">
          <RadioGroup
            value={selectedValue}
            onValueChange={(value: ChartType) => setSelectedValue(value)}
            className="group text-xs after:bg-background dark:after:bg-card/64 has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-[repeat(2,1fr)] items-center gap-0 font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-full after:shadow-xs dark:after:inset-shadow-[0_1px_rgb(255_255_255/0.15)] after:transition-[translate,box-shadow] after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] [&:after]:translate-x-[calc(var(--selected-index)*100%)]"
            data-state={selectedValue}
            style={
              {
                "--selected-index": selectedIndex,
              } as React.CSSProperties
            }
          >
            {chartOptions.map((value) => (
              <ViewOption key={value} id={id} value={value} />
            ))}
          </RadioGroup>
        </div>
      </CardHeader>
      <CardContent>
        {selectedValue === "bar-chart" ? (
          <BarChartWL chartData={chartData} />
        ) : (
          <RadialChart chartData={chartData} />
        )}
      </CardContent>
    </Card>
  );
}

const ViewOption = ({ id, value }: { id: string; value: ChartType }) => {
  const Icon = value === "bar-chart" ? BarChart3 : PieChart;
  return (
    <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none text-foreground has-data-[state=unchecked]:text-muted-foreground">
      <Icon className="h-4 w-4" />
      <RadioGroupItem id={`${id}-${value}`} value={value} className="sr-only" />
    </label>
  );
};
