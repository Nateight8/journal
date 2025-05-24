"use client";
import TradeLogs from "@/components/trades/trade-logs";
import { useQuery } from "@apollo/client";
import journalOperations, {
  GetLoggedJournalsResponse,
} from "@/graphql/journal-operationsl";
import { transformToTrade } from "./transformToTrade";

export default function JournalPage() {
  const { data, loading, error } = useQuery<GetLoggedJournalsResponse>(
    journalOperations.Queries.getJournals
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-destructive">
        Error loading trade data: {error.message}
      </div>
    );
  }

  const trades = data?.getLoggedJournals?.map(transformToTrade) || [];

  return (
    <div className="px-4 md:px-0">
      <div className="space-y-4">
        <TradeLogs trades={trades} />
      </div>
    </div>
  );
}
