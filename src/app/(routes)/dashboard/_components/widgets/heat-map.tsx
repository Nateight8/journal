"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useState } from "react";

type TradeData = {
  date: Date;
  pnl: number;
  wonTrades: number;
  lostTrades: number;
};

// Mock data generator - replace with real data
function generateMockData(year: number, month: number): TradeData[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: TradeData[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // Only generate data for some days (random)
    if (Math.random() > 0.3) {
      const pnl = Math.floor(Math.random() * 5000) - 1000; // Random P&L between -1000 and 4000
      const wonTrades = Math.random(); // Random win rate between 0 and 1
      const lostTrades = Math.floor(Math.random() * 10) + 1; // 1-10 trades per day

      data.push({
        date: new Date(year, month, day),
        pnl,
        wonTrades,
        lostTrades,
      });
    }
  }

  return data;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function Heatmap() {
  const [currentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const [tradeData] = useState<TradeData[]>(() =>
    generateMockData(year, month)
  );

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  // Create array of days in month
  const days = [];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Add empty cells for days before the first day of the month
  const emptyCells = Array(firstDayOfMonth).fill(null);

  // Helper to get trade data for a specific day
  const getTradeDataForDay = (day: number) => {
    return tradeData.find((trade) => trade.date.getDate() === day);
  };

  return (
    <div className="p-4">
      <>
        {/* Day headers */}
        <div className="grid grid-cols-7">
          {DAYS_OF_WEEK.map((day) => (
            <CardTitle
              key={day}
              className="text-center font-medium text-sm py-2"
            >
              {day}
            </CardTitle>
          ))}
        </div>

        <div className="grid grid-cols-7  gap-1">
          {/* Empty cells for days before the first of the month */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-8"></div>
          ))}

          {/* Days of the month */}
          {days.map((day) => {
            const dayTradeData = getTradeDataForDay(day);
            const hasTrades = !!dayTradeData;
            const winRate = dayTradeData?.wonTrades ?? 0;
            const lossRate = dayTradeData?.lostTrades ?? 0;
            const pnl = dayTradeData?.pnl ?? 0;
            const totalTrades =
              (dayTradeData &&
                dayTradeData?.wonTrades + dayTradeData?.lostTrades) ||
              0;

            return (
              <Card key={day} className={`p-0 aspect-square  border-dashed  `}>
                <CardContent
                  className="flex size-full md:p-4 items-center justify-center rounded cursor-pointer group"
                  onClick={() =>
                    console.log("Selected:", new Date(year, month, day))
                  }
                >
                  <div className="relative size-full hover:grayscale-0 ease-in-out grayscale transition-all duration-500">
                    <div className="h-full flex flex-col">
                      <div className="mb-2">
                        <h2 className="text-xs uppercase text-foreground/80 tracking-wider font-mono">
                          {day}
                        </h2>
                      </div>
                      {hasTrades ? (
                        <>
                          <p
                            className={`text-lg font-bold ${
                              pnl >= 0 ? "text-primary" : "text-destructive"
                            }`}
                          >
                            {pnl >= 0 ? "+" : "-"}$
                            {Math.abs(pnl).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {totalTrades} trade{totalTrades !== 1 ? "s" : ""}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No trades
                        </p>
                      )}
                    </div>

                    {hasTrades && (
                      <div className="absolute bottom-0 left-0 right-0 flex gap-0.5 h-1 bg-muted/50 overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full "
                          style={{ width: `${winRate * 100}%` }}
                        ></div>
                        <div
                          className="bg-destructive h-full"
                          style={{ width: `${lossRate * 100}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </>
    </div>
  );
}
