"use client";

import {
  ArrowUp,
  ArrowDown,
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Component() {
  const metrics = [
    {
      value: "$45,231.89",
      label: "Total Revenue",
      icon: <DollarSign className="w-full h-full" />,
      change: "+20.1%",
      changeType: "increase",
      timeFrame: "from last month",
    },
    {
      value: "2,345",
      label: "Active Users",
      icon: <Users className="w-full h-full" />,
      change: "+15.3%",
      changeType: "increase",
      timeFrame: "from last week",
    },
    {
      value: "1,234",
      label: "Sales",
      icon: <ShoppingCart className="w-full h-full" />,
      change: "-2.5%",
      changeType: "decrease",
      timeFrame: "from yesterday",
    },
    {
      value: "89.2%",
      label: "Growth Rate",
      icon: <TrendingUp className="w-full h-full" />,
      change: "+8.1%",
      changeType: "increase",
      timeFrame: "from last quarter",
    },
    {
      value: "$12,543",
      label: "Average Order",
      icon: <DollarSign className="w-full h-full" />,
      change: "+5.7%",
      changeType: "increase",
      timeFrame: "from last month",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Key performance metrics at a glance
        </p>
      </div>

      {/* Mobile: full width, sm: 1/1.2 (slightly less), md: 1/3, lg: 1/4 */}
      <Carousel className="w-full">
        <CarouselContent className="-ml-1">
          {metrics.map((metric, index) => (
            <CarouselItem
              key={index}
              className="pl-1 basis-full sm:basis-5/6 md:basis-1/3 lg:basis-1/4"
            >
              <MetricCard metric={metric} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>

      {/* Alternative grid layout for comparison */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Grid Layout (for comparison)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {metrics.slice(0, 4).map((metric, index) => (
            <MetricCard key={index} metric={metric} />
          ))}
        </div>
      </div>
    </div>
  );
}
