"use client";

import {
  DashboardCardSkeleton,
  RecentTradesSkeleton,
  WelcomeSectionSkeleton,
} from "./skeleton";

export function LoadingDashboard() {
  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          <div className="p-6 space-y-6">
            {/* Welcome Section Skeleton */}
            <WelcomeSectionSkeleton />

            {/* Dashboard Cards Skeleton */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
              <DashboardCardSkeleton />
            </div>

            {/* Recent Trades Skeleton */}
            <RecentTradesSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}
