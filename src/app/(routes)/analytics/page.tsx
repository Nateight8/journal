"use client";

// import PerformanceTabs from "@/components/charts/performance-tabs";

// import { EquityCurve } from "@/components/charts/equity-curve";
// import tradeAnalyticsOperations, {
//   TradeAnalyticsData,
// } from "@/graphql/trade-analytics";
// import { useQuery } from "@apollo/client";
// import { Projected } from "@/components/charts/projected";
import WorkInProgress from "@/components/wip";

export default function Page() {
  // const { data } = useQuery<TradeAnalyticsData>(
  //   tradeAnalyticsOperations.Queries.tradeAnalytics
  // );

  return (
    <>
      <WorkInProgress />
      {/* <div className="px-4 md:px-0">
        <div className="space-y-4">
          <PerformanceTabs data={data?.tradersAnalytics.symbolAnalytics} />
          <EquityCurve data={data?.tradersAnalytics.equityCurve} />
          <Projected />
        </div>
      </div> */}
    </>
  );
}
