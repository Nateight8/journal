"use client";
import { useState } from "react";
import type React from "react";

import { CheckCircle, BookOpen, Target, Eye } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import WelcomeSection from "./welcome";
import DashboardPrompt from "@/components/journaling/journaling-prompt-v2";
import JournalTemplateDrawer from "@/components/journaling/template";
import { PortfolioOverview } from "@/graphql/dashboard-operations";

interface DashboardWithTemplateDrawerProps {
  children?: React.ReactNode;
  isOwner?: boolean;
  hasJournalTemplate?: boolean;
  hasTradingPlan?: boolean;
  onTemplateCreated?: (content: string) => void;
  onTradingPlanCreated?: (content: string) => void;
  journalTemplateData?: string;
  tradingPlanData?: string;
  userName?: string;
  userStats: PortfolioOverview;
}

export default function DashboardWithTemplateDrawer({
  children,
  isOwner = false,
  hasJournalTemplate = false,
  hasTradingPlan = false,
  onTemplateCreated,
  onTradingPlanCreated,
  journalTemplateData = "",
  tradingPlanData = "",
  userStats,
}: DashboardWithTemplateDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"journal" | "trading-plan">(
    "journal"
  );
  const [localHasJournal, setLocalHasJournal] = useState(hasJournalTemplate);
  const [localHasTradingPlan, setLocalHasTradingPlan] =
    useState(hasTradingPlan);

  const handleCreateTemplate = () => {
    console.log("Create journal template clicked - opening drawer");
    setDrawerMode("journal");
    setIsDrawerOpen(true);
  };

  const handleCreateTradingPlan = () => {
    console.log("Create trading plan clicked - opening drawer");
    setDrawerMode("trading-plan");
    setIsDrawerOpen(true);
  };

  const handleViewTemplate = () => {
    console.log(
      "View journal template clicked - opening drawer with existing data"
    );
    setDrawerMode("journal");
    setIsDrawerOpen(true);
  };

  const handleViewTradingPlan = () => {
    console.log(
      "View trading plan clicked - opening drawer with existing data"
    );
    setDrawerMode("trading-plan");
    setIsDrawerOpen(true);
  };

  const handleSaveTemplate = (content: string) => {
    console.log("Template saved:", content);
    if (drawerMode === "journal") {
      setLocalHasJournal(true);
      onTemplateCreated?.(content);
    } else {
      setLocalHasTradingPlan(true);
      onTradingPlanCreated?.(content);
    }
  };

  const handleCloseDrawer = () => {
    console.log("Closing drawer");
    setIsDrawerOpen(false);
  };

  const handlePromptDismiss = () => {
    console.log("Prompt dismissed");
  };

  // Determine what to show based on ownership status
  const showPrompt = !isOwner || !localHasJournal || !localHasTradingPlan;
  const showJournalPrompt = !localHasJournal;
  const showTradingPlanPrompt = !localHasTradingPlan;

  // Show welcome section if user has trading plan
  const showWelcomeSection = isOwner && localHasTradingPlan;

  // Get the appropriate initial content for the drawer
  const getInitialContent = () => {
    if (drawerMode === "journal") {
      return journalTemplateData;
    } else {
      return tradingPlanData;
    }
  };

  // Get the appropriate drawer title
  const getDrawerTitle = () => {
    if (drawerMode === "journal") {
      return localHasJournal
        ? "Edit Journal Template"
        : "Create Journal Template";
    } else {
      return localHasTradingPlan ? "Edit Trading Plan" : "Create Trading Plan";
    }
  };

  return (
    <TooltipProvider>
      <div className="relative h-full overflow-hidden">
        {/* Dashboard Content */}
        <div
          className={`h-full transition-transform duration-500 ease-out ${
            isDrawerOpen ? "scale-95 -translate-y-4" : "scale-100 translate-y-0"
          }`}
          style={{
            pointerEvents: isDrawerOpen ? "none" : "auto",
            transformOrigin: "center top",
          }}
        >
          {/* Show welcome section if user has trading plan */}
          {showWelcomeSection && (
            <div className="p-6">
              <WelcomeSection
                hasJournalTemplate={localHasJournal}
                hasTradingPlan={localHasTradingPlan}
                onCreateTemplate={handleCreateTemplate}
                onViewTradingPlan={handleViewTradingPlan}
                stats={userStats}
              />
            </div>
          )}

          {/* Show prompt if user doesn't have templates/plans */}
          {showPrompt && !showWelcomeSection && (
            <div className="p-6">
              <DashboardPrompt
                showTemplatePrompt={showJournalPrompt}
                showTradingPlanPrompt={showTradingPlanPrompt}
                onCreateTemplate={handleCreateTemplate}
                onCreateTradingPlan={handleCreateTradingPlan}
                onDismiss={handlePromptDismiss}
              />
            </div>
          )}

          {/* Show owner dashboard if user has templates/plans but no trading plan */}
          {isOwner &&
            (localHasJournal || localHasTradingPlan) &&
            !showWelcomeSection && (
              <div className="p-6">
                <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/20 p-2 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">
                              Your Trading Setup
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Manage your journal templates and trading plans
                            </p>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex flex-wrap items-center gap-4">
                          {/* Journal Template Status */}
                          {localHasJournal ? (
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="default"
                                className="bg-primary/10 text-primary"
                              >
                                <BookOpen className="w-3 h-3 mr-1" />
                                Journal Template Ready
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewTemplate}
                                    className="border-primary/30 text-primary hover:bg-primary/10"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Template
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View and edit your journal template</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCreateTemplate}
                              className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
                            >
                              <BookOpen className="w-4 h-4 mr-1" />
                              Create Journal Template
                            </Button>
                          )}

                          {/* Trading Plan Status */}
                          {localHasTradingPlan ? (
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="default"
                                className="bg-green-500/10 text-green-600 border-green-500/20"
                              >
                                <Target className="w-3 h-3 mr-1" />
                                Trading Plan Ready
                              </Badge>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleViewTradingPlan}
                                    className="border-green-500/30 text-green-600 hover:bg-green-500/10"
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    View Plan
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View and edit your trading plan</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCreateTradingPlan}
                              className="border-primary/30 text-primary hover:bg-primary/10"
                            >
                              <Target className="w-4 h-4 mr-1" />
                              Create Trading Plan
                            </Button>
                          )}
                        </div>

                        {/* Quick Actions */}
                        {localHasJournal && localHasTradingPlan && (
                          <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-3">
                              Quick Actions
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  console.log("Create new journal entry")
                                }
                              >
                                New Journal Entry
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  console.log("Review trading plan")
                                }
                              >
                                Review Plan
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => console.log("View analytics")}
                              >
                                View Analytics
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          {/* Rest of Dashboard Content */}
          <div className="h-full overflow-y-auto">{children}</div>
        </div>

        {/* Template/Plan Drawer */}
        <JournalTemplateDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          onSave={handleSaveTemplate}
          initialContent={getInitialContent()}
          title={getDrawerTitle()}
          mode={drawerMode}
        />
      </div>
    </TooltipProvider>
  );
}
