"use client";

// import { mockData } from "@/lib/mock-data";

import { Overview } from "@/components/charts/overview";
import Recent from "@/components/trades/recent";
// import { Performance } from "@/components/trades/performance";
// import { WinLossMeter } from "@/components/win-loss/radial-chart";
// import HeatMap from "@/components/charts/heat-map";
// import WinLossState from "@/components/win-loss/win-loss-stats";
import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@apollo/client";
import dashboardOperations, {
  DashboardData,
} from "@/graphql/dashboard-operations";
import WorkInProgress from "@/components/wip";
import DashboardPrompt from "@/components/journaling/journaling-prompt-v2";

export default function Client() {
  const { user } = useAuth();

  const { data } = useQuery<DashboardData>(
    dashboardOperations.Queries.dashboardData
  );

  // data?.dashboard.tradePerformance <==winLossState
  return (
    <>
      <div className="flex items-center justify-between gap-4 px-4 md:px-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{user?.name}!</h1>
          <p className="text-sm text-muted-foreground">
            Here&rsquo;s an overview of your performance lately. Keep track of
            your progress and make the most of it!
          </p>
        </div>
      </div>

      {/* Numbers */}
      <Overview data={data?.dashboard.portfolioOverview} />
      <DashboardPrompt />

      <div className="md:grid hidden  md:grid-cols-2 gap-4 w-full">
        {/* <Performance data={mockData.performance.metrics} /> */}
        <WorkInProgress
          variant="compact"
          title="Trader's Performance (Coming Soon)"
          description="View your recent trades and see how they're performing."
          progress={35}
        />

        <Recent trades={data?.dashboard.recentTrades || []} />
      </div>

      {/* <div className="px-4 md:px-0 md:hidden">
        <div className="space-y-4">
          <Recent trades={data?.dashboard.recentTrades || []} />
        </div>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-full">
          <WorkInProgress
            variant="compact"
            title="PNL Stats (Coming Soon)"
            description="View your PNL stats and see how they're performing."
            progress={15}
          />
          {/* <WinLossState winLossStats={data?.dashboard.winLossTradeStats} /> */}
        </div>
        <div className="h-full">
          {/* <HeatMap /> */}
          <WorkInProgress
            variant="compact"
            title="Heat map (Coming Soon)"
            description="View your heat map and see how they're performing."
            progress={15}
          />
        </div>
      </div>

      {/* Table */}
    </>
  );
}
