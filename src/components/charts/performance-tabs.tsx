"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EmptyChart } from "./empty-chart";
import {
  Bitcoin,
  DollarSign,
  LineChart,
  TrendingUp,
  Clock,
} from "lucide-react";
import { PerformanceCarrousel } from "./performance-carrousel";

export default function PerformanceTabs() {
  const handleLogTrade = (category: string) => {
    console.log("Logging trade for", category);
  };

  return (
    <Tabs defaultValue="stocks" className="w-full">
      <div className="border-b w-full">
        <ScrollArea className="w-full">
          <TabsList className="h-auto rounded-none border-b bg-transparent p-0 inline-flex">
            {tablist.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="data-[state=active]:after:bg-primary border-none cursor-pointer relative rounded-none py-2 px-4 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" className="h-0" />
        </ScrollArea>
      </div>
      <TabsContent value="stocks">
        <PerformanceCarrousel />
      </TabsContent>

      <TabsContent value="crypto">
        <EmptyChart
          icon={Bitcoin}
          category="Crypto"
          onAction={() => handleLogTrade("crypto")}
        />
      </TabsContent>

      <TabsContent value="forex">
        <EmptyChart
          icon={DollarSign}
          category="Forex"
          onAction={() => handleLogTrade("forex")}
        />
      </TabsContent>

      <TabsContent value="options">
        <EmptyChart
          icon={Clock}
          category="Options"
          onAction={() => handleLogTrade("options")}
        />
      </TabsContent>

      <TabsContent value="indices">
        <EmptyChart
          icon={LineChart}
          category="Indices"
          onAction={() => handleLogTrade("indices")}
        />
      </TabsContent>

      <TabsContent value="futures">
        <EmptyChart
          icon={TrendingUp}
          category="Futures"
          onAction={() => handleLogTrade("futures")}
        />
      </TabsContent>
    </Tabs>
  );
}

const tablist = [
  {
    value: "stocks",
    label: "Stocks",
  },
  {
    value: "crypto",
    label: "Crypto",
  },
  {
    value: "forex",
    label: "Forex",
  },
  {
    value: "options",
    label: "Options",
  },
  {
    value: "indices",
    label: "Indices",
  },
  {
    value: "futures",
    label: "Futures",
  },
];
