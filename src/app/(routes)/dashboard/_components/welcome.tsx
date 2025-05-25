"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Notebook } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Overview } from "@/components/charts/overview";
import { PortfolioOverview } from "@/graphql/dashboard-operations";
import { useAuth } from "@/contexts/auth-context";

interface WelcomeSectionProps {
  userName?: string;
  hasJournalTemplate: boolean;
  hasTradingPlan: boolean;
  onCreateTemplate: () => void;
  onViewTradingPlan: () => void;
  stats: PortfolioOverview;
}

export default function WelcomeSection({
  onCreateTemplate,
  onViewTradingPlan,
  stats,
}: WelcomeSectionProps) {
  const { user } = useAuth();
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between gap-4 px-4 md:px-0">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">{user?.name}!</h1>
              <p className="text-sm text-muted-foreground">
                Track your trades, analyze patterns, and refine your strategy
                for better results.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {/* Create Journal Template Button */}

              <Button
                variant="outline"
                size="icon"
                onClick={onCreateTemplate}
                className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
              >
                <BookOpen className="w-4 h-4" />
              </Button>

              {/* View Trading Plan Button */}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onViewTradingPlan}
                      className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                    >
                      <Notebook className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View and edit your trading plan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Action Buttons */}

          {/* Latest Stats */}
          <div className=" rounded-lg p-4">
            <Overview data={stats} />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Create new journal entry")}
            >
              New Journal Entry
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("View analytics")}
            >
              View Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log("Review performance")}
            >
              Review Performance
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
