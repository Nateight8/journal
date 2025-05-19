import TradeLogs from "@/components/trades/trade-logs";
import { mockData } from "@/lib/mock-data";

export default async function JournalPage() {
  return (
    <>
      <div className="space-y-4">
        <TradeLogs trades={mockData.trades} />
      </div>
    </>
  );
}
