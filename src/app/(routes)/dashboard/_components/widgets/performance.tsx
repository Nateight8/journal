"use client";

import React, { JSX } from "react";

import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Award,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function Performance() {
  return (
    <div className="w-full lg:col-span-3 lg:border-x-2 border-dashed sm:py-4 overflow-x-hidden">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 2.5,
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
        {tradingMetrics.map((metric) => (
          <SwiperSlide
            className="md:shadow shadow-black md:border"
            key={metric.id}
          >
            <MetricCard metric={metric} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

function MetricCard({
  metric,
}: {
  metric: {
    value: string;
    label: string;
    icon: JSX.Element;
    change: string;
    changeType: string;
    timeFrame: string;
  };
}) {
  return (
    <div className="p-1 h-full">
      <Card className="h-full p-0 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
        <CardContent className="p-2 sm:p-4 flex items-start h-full">
          {/* Icon - responsive sizing */}
          <div className="hidden md:flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-muted/50 mr-2 sm:mr-3 mt-1 flex-shrink-0">
            <div className="w-4 h-4 sm:w-5 sm:h-5">{metric.icon}</div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Label - responsive text */}
            <div className="flex justify-between items-start">
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider leading-tight">
                {metric.label}
              </span>
            </div>

            {/* Value - responsive sizing */}
            <div className="text-sm md:text-xl sm:text-2xl font-bold mt-1 leading-tight truncate">
              {metric.value}
            </div>

            {/* Change indicator - responsive */}
            <div
              className={`flex items-center text-[10px] sm:text-xs mt-1 ${
                metric.changeType === "increase"
                  ? "text-primary"
                  : "text-destructive"
              }`}
            >
              {metric.changeType === "increase" ? (
                <ArrowUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
              ) : (
                <ArrowDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 flex-shrink-0" />
              )}
              <span className="font-medium">{metric.change}</span>
              <span className="text-muted-foreground ml-1 truncate">
                {metric.timeFrame}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const tradingMetrics = [
  {
    id: "1",
    value: "$24,850",
    label: "TOTAL P&L",
    icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
    change: "+$1,250",
    changeType: "increase",
    timeFrame: "this month",
  },
  {
    id: "2",
    value: "62%",
    label: "WIN RATE",
    icon: <TrendingUp className="h-5 w-5 text-green-400" />,
    change: "+3.1%",
    changeType: "increase",
    timeFrame: "vs last month",
  },
  {
    id: "3",
    value: "2.4",
    label: "AVG R:R",
    icon: <Target className="h-5 w-5 text-blue-400" />,
    change: "-0.2",
    changeType: "decrease",
    timeFrame: "this month",
  },
  {
    id: "4",
    value: "38",
    label: "TRADES",
    icon: <Activity className="h-5 w-5 text-purple-400" />,
    change: "+5",
    changeType: "increase",
    timeFrame: "this month",
  },
  {
    id: "5",
    value: "24min",
    label: "AVG DURATION",
    icon: <Clock className="h-5 w-5 text-amber-400" />,
    change: "-2min",
    changeType: "decrease",
    timeFrame: "vs last month",
  },
  {
    id: "6",
    value: "14",
    label: "WIN STREAK",
    icon: <Award className="h-5 w-5 text-rose-400" />,
    change: "+3",
    changeType: "increase",
    timeFrame: "current streak",
  },
  {
    id: "7",
    value: "$1,250",
    label: "AVG WIN",
    icon: <DollarSign className="h-5 w-5 text-green-400" />,
    change: "+$85",
    changeType: "increase",
    timeFrame: "this month",
  },
  {
    id: "8",
    value: "$480",
    label: "AVG LOSS",
    icon: <DollarSign className="h-5 w-5 text-red-400" />,
    change: "-$35",
    changeType: "decrease",
    timeFrame: "this month",
  },
];
