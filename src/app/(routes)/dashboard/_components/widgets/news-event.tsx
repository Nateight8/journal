"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

export default function NewsEvent() {
  return (
    <Card className="border-none shadow-none lg:col-span-2 ">
      <CardHeader className="px-0">
        <CardTitle>Upcoming Events(June 3)</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="w-full lg:col-span-3 lg:border-x-2 border-dashed sm:py-4 overflow-x-hidden">
          <Swiper
            slidesPerView={1}
            spaceBetween={10}
            breakpoints={{
              320: {
                slidesPerView: 1.5,
                spaceBetween: 10,
              },
              480: {
                slidesPerView: 2,
                spaceBetween: 12,
              },
              640: {
                slidesPerView: 3,
                spaceBetween: 16,
              },
            }}
            modules={[Pagination]}
            className="w-full h-full px-2"
          >
            {forexFactoryNewsMock.map((news) => (
              <SwiperSlide
                className="md:shadow  shadow-black md:border"
                key={news.id}
              >
                <div className="p-1  h-full hover:cursor-pointer">
                  <Card className="h-full gap-2 relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 hover:bg-muted/10 transition-colors">
                    <div
                      className={`absolute right-0 top-0 border w-14 h-4 ${
                        news.impact === "High" ? "bg-destructive" : "bg-muted"
                      }`}
                    />

                    <CardHeader className="mb-0">
                      <CardTitle className="text-sm sm:text-md mb-0 line-clamp-2">
                        {news.event}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="flex items-start h-full">
                      <p className="text-muted-foreground text-xs md:text-base line-clamp-3">
                        {news.description}
                      </p>
                    </CardContent>

                    <CardFooter>hello world</CardFooter>
                  </Card>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </CardContent>
    </Card>
  );
}

const forexFactoryNewsMock = [
  {
    id: "1",
    country: "United States",
    currency: "USD",
    event: "Non-Farm Employment Change",
    time: "2025-06-03T12:30:00Z",
    actual: 285000,
    forecast: 250000,
    previous: 275000,
    impact: "High",
    description:
      "Measures the change in the number of employed people during the previous month, excluding the farming industry. High employment is bullish for the USD.",
  },
  {
    id: "2",
    country: "Eurozone",
    currency: "EUR",
    event: "ECB Interest Rate Decision",
    time: "2025-06-03T11:45:00Z",
    actual: "4.50%",
    forecast: "4.50%",
    previous: "4.25%",
    impact: "High",
    description:
      "The ECB’s rate decision impacts the value of the euro. A higher rate tends to be bullish for the currency.",
  },
  {
    id: "3",
    country: "United Kingdom",
    currency: "GBP",
    event: "CPI y/y",
    time: "2025-06-02T07:00:00Z",
    actual: "3.2%",
    forecast: "3.1%",
    previous: "3.0%",
    impact: "Medium",
    description:
      "Consumer Price Index measures the change in the price of goods and services. It's the main indicator of inflation.",
  },
  {
    id: "4",
    country: "Australia",
    currency: "AUD",
    event: "Retail Sales m/m",
    time: "2025-06-01T01:30:00Z",
    actual: "0.5%",
    forecast: "0.4%",
    previous: "0.3%",
    impact: "Medium",
    description:
      "Monthly change in the total value of retail sales. Indicates consumer spending strength.",
  },
  {
    id: "5",
    country: "Japan",
    currency: "JPY",
    event: "BOJ Press Conference",
    time: "2025-06-03T06:00:00Z",
    actual: null,
    forecast: null,
    previous: null,
    impact: "High",
    description:
      "BOJ officials comment on future monetary policy. High volatility is expected during the press conference.",
  },
];
