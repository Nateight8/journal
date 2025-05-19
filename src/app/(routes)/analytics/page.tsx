import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experiment 01 - Crafted.is",
};

import PerformanceTabs from "@/components/charts/performance-tabs";

import { EquityCurve } from "@/components/charts/equity-curve";

export default function Page() {
  return (
    <div className="px-4 md:px-0">
      <div className="space-y-4">
        <PerformanceTabs />
        <EquityCurve />
      </div>
    </div>
  );
}
