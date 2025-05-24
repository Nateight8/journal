import { gql } from "@apollo/client";

const tradeAnalyticsOperations = {
  Queries: {
    tradeAnalytics: gql`
      query TradersAnalytics($category: String) {
        tradersAnalytics {
          symbolAnalytics(category: $category) {
            symbol
            category
            performance {
              time
              pnl
            }
          }
          equityCurve {
            time
            equity
          }
        }
      }
    `,
  },
};

export default tradeAnalyticsOperations;

export interface PerformanceData {
  time: string;
  pnl: number;
}

export interface EquityCurveData {
  time: string;
  equity: number;
}

export interface SymbolAnalytic {
  symbol: string;
  category: string;
  performance: PerformanceData[];
}

export interface TradeAnalyticsData {
  tradersAnalytics: {
    symbolAnalytics: SymbolAnalytic[];
    equityCurve: EquityCurveData[];
  };
}

export interface TradeAnalyticsVariables {
  category?: string;
}
