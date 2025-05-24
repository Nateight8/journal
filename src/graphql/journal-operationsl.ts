import { gql } from "@apollo/client";

const journalOperations = {
  Mutations: {
    createJournal: gql`
      mutation CreateJournal($input: CreateJournalInput!) {
        createJournal(input: $input) {
          success
          message
        }
      }
    `,

    updateJournal: gql`
      mutation UpdateJournal($input: UpdateJournalInput!) {
        updateJournal(input: $input) {
          success
          message
        }
      }
    `,
  },

  Queries: {
    getJournals: gql`
      query GetLoggedJournals {
        getLoggedJournals {
          updatedAt
          targetHit
          size
          side
          plannedTakeProfit
          plannedStopLoss
          plannedEntryPrice
          note
          instrument
          id
          exitPrice
          executionStyle
          executionNotes
          executedStopLoss
          executedEntryPrice
          createdAt
          accountId
        }
      }
    `,
  },
};

export default journalOperations;

export interface JournalEntry {
  id: string;
  instrument: string;
  side: "buy" | "sell";
  size: number;
  plannedEntryPrice: number;
  plannedStopLoss?: number;
  plannedTakeProfit?: number;
  executedEntryPrice?: number;
  executedStopLoss?: number;
  exitPrice?: number;
  executionStyle: "MARKET" | "LIMIT";
  executionNotes?: string;
  note?: string;
  targetHit?: boolean;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetLoggedJournalsResponse {
  getLoggedJournals: JournalEntry[];
}
