"use client";

import {
  format,
  startOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
} from "date-fns";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

type TradeData = {
  trades: number;
  pnl: number;
  outcome: "win" | "loss";
};

type TradeHistory = {
  [key: string]: TradeData;
};

// Mock trade data for a month showing realistic trading patterns
const tradeHistory: TradeHistory = {
  // Week 1 - Mixed results
  "2024-03-04": { trades: 2, pnl: 250, outcome: "win" }, // Monday
  "2024-03-05": { trades: 1, pnl: -100, outcome: "loss" }, // Tuesday
  "2024-03-07": { trades: 3, pnl: 450, outcome: "win" }, // Thursday
  "2024-03-08": { trades: 1, pnl: -75, outcome: "loss" }, // Friday

  // Week 2 - Good week
  "2024-03-11": { trades: 2, pnl: 300, outcome: "win" }, // Monday
  "2024-03-12": { trades: 2, pnl: 275, outcome: "win" }, // Tuesday
  "2024-03-14": { trades: 3, pnl: 500, outcome: "win" }, // Thursday
  "2024-03-15": { trades: 1, pnl: 150, outcome: "win" }, // Friday

  // Week 3 - Bad week
  "2024-03-18": { trades: 1, pnl: -200, outcome: "loss" }, // Monday
  "2024-03-19": { trades: 2, pnl: -150, outcome: "loss" }, // Tuesday
  "2024-03-21": { trades: 1, pnl: -125, outcome: "loss" }, // Thursday
  "2024-03-22": { trades: 1, pnl: -100, outcome: "loss" }, // Friday

  // Week 4 - Recovery week
  "2024-03-25": { trades: 2, pnl: 325, outcome: "win" }, // Monday
  "2024-03-26": { trades: 1, pnl: 175, outcome: "win" }, // Tuesday
  "2024-03-28": { trades: 2, pnl: -50, outcome: "loss" }, // Thursday
  "2024-03-29": { trades: 3, pnl: 400, outcome: "win" }, // Friday
};

type TradeDay = {
  date: Date;
  trades?: number;
  pnl?: number;
  outcome?: "win" | "loss";
};

export default function HeatMap() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);

  // Calculate the middle week of the month
  const middleWeekStart = startOfWeek(addWeeks(monthStart, 1));
  const calendarEnd = endOfWeek(addWeeks(middleWeekStart, 2));
  const days = eachDayOfInterval({ start: middleWeekStart, end: calendarEnd });

  const getDayColor = (day: TradeDay) => {
    if (!day.trades) return "bg-muted/10";
    return day.outcome === "win"
      ? "bg-primary/20 hover:bg-primary/30"
      : "bg-destructive/20 hover:bg-destructive/30";
  };

  const getDayTooltip = (day: TradeDay) => {
    if (!day.trades) return null;
    return `${day.trades} trade${day.trades > 1 ? "s" : ""} - ${
      day.outcome === "win" ? "+" : "-"
    }$${Math.abs(day.pnl || 0)}`;
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Trade History</CardTitle>
            <CardDescription>
              Weekly trading activity for {format(currentDate, "MMMM yyyy")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-1 font-medium text-muted-foreground">
              {day}
            </div>
          ))}
          {days.map((date, i) => {
            const dayData = tradeHistory[format(date, "yyyy-MM-dd")];
            const day: TradeDay = {
              date,
              ...dayData,
            };
            const isCurrentMonth = isSameMonth(date, currentDate);
            const tooltipContent = getDayTooltip(day);

            const dayElement = (
              <div
                className={`
                  relative border  aspect-square rounded-md p-1 text-xs
                  ${getDayColor(day)}
                  ${!isCurrentMonth ? "opacity-30" : ""}
                  ${isToday(date) ? "ring-2 ring-primary" : ""}
                  transition-colors
                `}
              >
                <span className="absolute inset-0 flex items-center justify-center">
                  {format(date, "d")}
                </span>
                {day.trades && (
                  <span className="absolute bottom-1 right-1 text-[10px] font-medium">
                    {day.trades}
                  </span>
                )}
              </div>
            );

            return tooltipContent ? (
              <TooltipProvider key={i}>
                <Tooltip>
                  <TooltipTrigger asChild>{dayElement}</TooltipTrigger>
                  <TooltipContent>
                    <p>{format(date, "MMMM d, yyyy")}</p>
                    <p className="font-medium">{tooltipContent}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div key={i}>{dayElement}</div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
