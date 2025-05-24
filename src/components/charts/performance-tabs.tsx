"use client";
import { useState, useMemo } from "react";
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
import { SymbolAnalytic } from "@/graphql/trade-analytics";

export default function PerformanceTabs({
  data = [],
}: {
  data?: SymbolAnalytic[];
}) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const handleLogTrade = (category: string) => {
    console.log(`Logging trade for ${category}`);
  };

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    console.log("Filtering data for tab:", activeTab);
    console.log("Original data:", data);

    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log("No data or invalid data format");
      return [];
    }

    if (activeTab === "all") {
      console.log("Returning all data");
      return data;
    }

    const filtered = data.filter((item) => {
      if (!item || !item.category) {
        console.warn("Item missing category:", item);
        return false;
      }
      const categoryMatch =
        item.category.toLowerCase() === activeTab.toLowerCase();
      console.log(
        `Item category: ${item.category}, matches ${activeTab}: ${categoryMatch}`
      );
      return categoryMatch;
    });

    console.log("Filtered data:", filtered);
    return filtered;
  }, [data, activeTab]);

  console.log("filteredData", filteredData);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
      <TabsContent value="all">
        <PerformanceCarrousel data={filteredData} />
      </TabsContent>

      <TabsContent value="stocks">
        {filteredData.length > 0 ? (
          <PerformanceCarrousel data={filteredData} />
        ) : (
          <EmptyChart
            icon={LineChart}
            category="Stocks"
            onAction={() => handleLogTrade("stocks")}
          />
        )}
      </TabsContent>

      <TabsContent value="crypto">
        {filteredData.length > 0 ? (
          <PerformanceCarrousel data={filteredData} />
        ) : (
          <EmptyChart
            icon={Bitcoin}
            category="Stocks"
            onAction={() => handleLogTrade("stocks")}
          />
        )}
      </TabsContent>

      <TabsContent value="forex">
        {filteredData.length > 0 ? (
          <PerformanceCarrousel data={filteredData} />
        ) : (
          <EmptyChart
            icon={DollarSign}
            category="Stocks"
            onAction={() => handleLogTrade("stocks")}
          />
        )}
      </TabsContent>

      <TabsContent value="options">
        {filteredData.length > 0 ? (
          <PerformanceCarrousel data={filteredData} />
        ) : (
          <EmptyChart
            icon={Clock}
            category="Stocks"
            onAction={() => handleLogTrade("stocks")}
          />
        )}
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
    value: "all",
    label: "All",
  },
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
