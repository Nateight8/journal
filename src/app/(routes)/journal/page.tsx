"use client";
import TradeLogs from "@/components/trades/trade-logs";

export default function JournalPage() {
  // Mock data for development
  const trades = [
    {
      id: "1",
      date: "2025-06-05T09:30:00Z",
      symbol: "AAPL",
      direction: "Long" as const,
      projectedEntry: 185.5,
      projectedSL: 183.75,
      projectedTP: 190.25,
      actualEntry: 185.6,
      actualExit: 189.8,
      didHitTP: true,
      actualPL: 4.2,
      maxPossiblePL: 4.75,
      efficiency: 88.4,
      notes: "Strong uptrend, broke key resistance",
      accountId: "acc123",
    },
    {
      id: "2",
      date: "2025-06-04T10:15:00Z",
      symbol: "MSFT",
      direction: "Short" as const,
      projectedEntry: 420.75,
      projectedSL: 425.5,
      projectedTP: 410.0,
      actualEntry: 421.0,
      actualExit: 415.25,
      didHitTP: false,
      actualPL: 5.75,
      maxPossiblePL: 10.75,
      efficiency: 53.5,
      notes: "Reversal at resistance, took partial profits early",
      accountId: "acc123",
    },
    {
      id: "3",
      date: "2025-06-03T13:45:00Z",
      symbol: "TSLA",
      direction: "Long" as const,
      projectedEntry: 175.25,
      projectedSL: 172.0,
      projectedTP: 182.5,
      actualEntry: 175.5,
      actualExit: 180.75,
      didHitTP: false,
      actualPL: 5.25,
      maxPossiblePL: 7.25,
      efficiency: 72.4,
      notes: "Breakout trade, strong volume",
      accountId: "acc123",
    },
    {
      id: "4",
      date: "2025-06-02T11:20:00Z",
      symbol: "NVDA",
      direction: "Short" as const,
      projectedEntry: 950.0,
      projectedSL: 965.0,
      projectedTP: 920.0,
      actualEntry: 951.5,
      actualExit: 962.75,
      didHitTP: false,
      actualPL: -11.25,
      maxPossiblePL: 30.0,
      efficiency: 0,
      notes: "Stop loss hit, news catalyst",
      accountId: "acc123",
    },
    {
      id: "5",
      date: "2025-05-30T14:10:00Z",
      symbol: "AMZN",
      direction: "Long" as const,
      projectedEntry: 182.75,
      projectedSL: 180.5,
      projectedTP: 188.0,
      actualEntry: 182.9,
      actualExit: 187.5,
      didHitTP: true,
      actualPL: 4.6,
      maxPossiblePL: 5.25,
      efficiency: 87.6,
      notes: "Strong earnings play, target hit",
      accountId: "acc123",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="space-y-4">
        <TradeLogs trades={trades} />
      </div>
    </div>
  );
}
