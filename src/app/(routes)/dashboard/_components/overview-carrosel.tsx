import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export function OverviewCarrousel() {
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem
            key={index}
            className="pl-1 md:basis-1/2 lg:basis-1/3  "
          >
            <div className="p-1">//</div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
