"use client";

import DashboardWithTemplateDrawer from "./_components/template-drawer";
import { useAuth } from "@/contexts/auth-context";
import { useMutation, useQuery } from "@apollo/client";
import dashboardOperations, {
  DashboardData,
} from "@/graphql/dashboard-operations";
import journalOperations from "@/graphql/journal-operationsl";

export default function Page() {
  // Sample user stats - you can fetch this from your API
  const { user } = useAuth();

  const { data, loading } = useQuery<DashboardData>(
    dashboardOperations.Queries.dashboardData
  );

  const [updateJournalTemplate] = useMutation(
    journalOperations.Mutations.updateJournalTemplate
  );

  const [updateTradingPlan] = useMutation(
    journalOperations.Mutations.updateTradingPlan
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  const hasJournalTemplate = data?.dashboard.tradingPlan.isOwner;
  const hasTradingPlan = data?.dashboard.tradingPlan.isOwner;
  const note = data?.dashboard?.tradingPlan?.note;
  const journalNote = data?.dashboard?.journalTemplate?.note;

  // Safely extract HTML content from the note with a fallback default
  const tradingPlanData: string =
    (typeof note?.html === "string" ? note.html : null) ||
    "<h1>My Trading Plan</h1><p>Create your trading plan to get started</p>";
  const journalTemplateData: string =
    (typeof journalNote?.html === "string" ? journalNote.html : null) ||
    "<h1>My Journal Template</h1><p>Create your journal template to get started</p>";

  return (
    <div className="flex h-screen ">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content with Template Drawer */}
        <div className="flex-1 overflow-hidden">
          {data?.dashboard && (
            <DashboardWithTemplateDrawer
              isOwner={true}
              hasJournalTemplate={hasJournalTemplate!}
              hasTradingPlan={hasTradingPlan!}
              journalTemplateData={journalTemplateData}
              tradingPlanData={tradingPlanData}
              userName={user?.name} // You can customize this
              userStats={data?.dashboard.portfolioOverview} // Pass the stats
              onTemplateCreated={(content) => {
                updateJournalTemplate({
                  variables: {
                    note: content,
                  },
                });
              }}
              onTradingPlanCreated={(content) => {
                updateTradingPlan({
                  variables: {
                    note: content,
                  },
                });
              }}
            >
              {/* Dashboard Content */}
            </DashboardWithTemplateDrawer>
          )}
        </div>
      </div>
    </div>
  );
}
