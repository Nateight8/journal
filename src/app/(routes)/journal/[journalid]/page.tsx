import TradeJournalEntry from "./_components/journal-client-v2";

interface JournalPageProps {
  params: {
    journalid: string;
  };
}

export default function JournalPage({ params }: JournalPageProps) {
  return <TradeJournalEntry journalId={params.journalid} />;
}
