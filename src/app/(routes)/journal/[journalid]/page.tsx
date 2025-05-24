import TradeJournalEntry from "./_components/journal-client-v2";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ journalid: string }>;
}) {
  const resolvedParams = await params;
  return <TradeJournalEntry journalId={resolvedParams.journalid} />;
}
