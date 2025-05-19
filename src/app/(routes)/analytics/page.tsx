import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiment 01 - Crafted.is",
};

import PerformanceTabs from "@/components/charts/performance-tabs";

import { EquityCurve } from "@/components/charts/equity-curve";

export default function Page() {
  return (
    <>
      {/* <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Oilà, Larry!</h1>
          <p className="text-sm text-muted-foreground">
            Here&rsquo;s an overview of your performance lately. Keep track of
            your progress and make the most of it!
          </p>
        </div>
        <Button className="px-3">Add Contact</Button>
      </div> */}
      {/* Numbers */}
      {/* <Overview /> */}
      <PerformanceTabs />

      <EquityCurve />

      {/* Table */}
    </>
  );
}
