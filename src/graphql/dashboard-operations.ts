import { gql } from "@apollo/client";

const dashboardOperations = {
  Queries: {
    dashboardData: gql`
      query Dashboard {
        dashboard {
          recentTrades {
            symbol
            status
            projectedSL
            projectedEntry
            maxPossiblePL
            id
            direction
            date
            balance
            actualPL
            actualExit
            actualEntry
            account
          }
          portfolioOverview {
            totalValue
            pnl {
              value
              percentage
            }
            overviewStats {
              winRate {
                value
                percentage
              }
              tradeStats {
                total
                open
              }
              profitFactor {
                value
                percentage
              }
              maxDrawdown {
                value
                percentage
              }
              avgReturn {
                value
                percentage
              }
            }
          }
          winLossTradeStats {
            wins
            totalTrades
            totalRisk
            totalReward
            losses
          }
        }
      }
    `,
  },
};

export default dashboardOperations;

interface ValueWithPercentage {
  value: number;
  percentage: number;
}

interface PortfolioOverview {
  totalValue: number;
  pnl: ValueWithPercentage;
  overviewStats: OverviewStats;
}

interface TradeStats {
  total: number;
  open: number;
}

interface OverviewStats {
  winRate: ValueWithPercentage;
  profitFactor: ValueWithPercentage;
  maxDrawdown: ValueWithPercentage;
  avgReturn: ValueWithPercentage;
  tradeStats: TradeStats;
}

interface RecentTrade {
  id: string;
  symbol: string;
  status: string;
  projectedSL: number;
  projectedEntry: number;
  maxPossiblePL: number;
  direction: string;
  date: string;
  balance: number;
  actualPL: number;
  actualExit: number;
  actualEntry: number;
  account: string;
}

interface WinLossTradeStats {
  wins: number;
  totalTrades: number;
  totalRisk: number;
  totalReward: number;
  losses: number;
}

interface DashboardData {
  dashboard: {
    portfolioOverview: PortfolioOverview;
    recentTrades: RecentTrade[];
    winLossTradeStats: WinLossTradeStats;
  };
}

export type {
  DashboardData,
  PortfolioOverview,
  RecentTrade,
  WinLossTradeStats,
  ValueWithPercentage,
  OverviewStats,
};
