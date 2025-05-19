import type { Metadata } from "next";
import { mockData } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Experiment 01 - Crafted.is",
};

import { Overview } from "@/components/charts/overview";
import { Recent } from "@/components/trades/recent";
import { Performance } from "@/components/trades/performance";
// import { WinLossMeter } from "@/components/win-loss/radial-chart";
import HeatMap from "@/components/charts/heat-map";
import WinLossState from "@/components/win-loss/win-loss-stats";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 md:px-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Oilà, Larry!</h1>
          <p className="text-sm text-muted-foreground">
            Here&rsquo;s an overview of your performance lately. Keep track of
            your progress and make the most of it!
          </p>
        </div>
      </div>
      {/* Numbers */}
      <Overview data={mockData.performance.overview} />

      <div className="grid  md:grid-cols-2 gap-4">
        <Performance data={mockData.performance.metrics} />
        <Recent data={mockData.trades} accounts={mockData.accounts} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full">
          <WinLossState />
        </div>
        <div className="h-full">
          <HeatMap />
        </div>
      </div>

      {/* Table */}
    </>
  );
}
