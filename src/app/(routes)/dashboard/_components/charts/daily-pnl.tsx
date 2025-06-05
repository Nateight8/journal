"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { CustomTooltipContent } from "@/components/charts/chart-extra";

interface PnLData {
  date: string;
  pnl: number;
}

interface DailyPnlProps {
  pnlData: PnLData[];
  title?: string;
  description?: string;
}

const chartConfig = {
  pnl: {
    label: "P&L",
    color: "#3b82f6", // blue-500
  },
} as const;

export function DailyPnl({ pnlData = [] }: DailyPnlProps) {
  if (!pnlData || pnlData.length === 0) {
    return (
      <>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </>
    );
  }

  return (
    <div className="h-full pt-6">
      <>
        <ChartContainer config={chartConfig} className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pnlData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="2 2"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={12}
                stroke="var(--border)"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                interval="preserveStartEnd"
              />
              <Tooltip
                content={
                  <CustomTooltipContent
                    colorMap={{
                      pnl: "var(--chart-1)",
                    }}
                    labelMap={{
                      pnl: "P&L",
                    }}
                    dataKeys={["pnl"]}
                    valueFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                }
                cursor={{ fill: "hsl(var(--primary)/0.1)" }}
              />
              <Bar dataKey="pnl" radius={[0, 0, 0, 0]}>
                {pnlData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? "var(--primary)" : "var(--chart-5)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </>
    </div>
  );
}
