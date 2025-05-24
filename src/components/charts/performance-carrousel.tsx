import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
// import { SymbolAnalyticsChart } from "./symbol-analytics";
import { SymbolAnalytic } from "@/graphql/trade-analytics";
import { SymbolAnalyticsChart } from "./symbol-analytics";

export function PerformanceCarrousel({
  data = [],
}: {
  data?: SymbolAnalytic[];
}) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full flex items-center justify-center py-8 text-muted-foreground">
        No performance data available
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {data.map((item, index) => (
          <CarouselItem
            key={`${item.symbol}-${index}`}
            className="pl-1 md:basis-1/2 lg:basis-1/3"
          >
            <div className="p-1">
              <SymbolAnalyticsChart data={item} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
