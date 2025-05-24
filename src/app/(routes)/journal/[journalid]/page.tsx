import TradeJournalEntry from "./_components/journal-client-v2";

interface PageProps {
  params: {
    journalid: string;
  };
}

export default function Page({ params }: PageProps) {
  const { journalid } = params;

  return <TradeJournalEntry journalId={journalid} />;
}
