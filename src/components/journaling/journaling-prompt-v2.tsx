"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  FileText,
  Target,
  TrendingUp,
  ArrowRight,
  Lightbulb,
  CheckCircle,
  PenTool,
  Calendar,
} from "lucide-react";

interface DashboardPromptProps {
  onCreateTemplate?: () => void;
  onCreateTradingPlan?: () => void;
  onDismiss?: () => void;
  showTemplatePrompt?: boolean;
  showTradingPlanPrompt?: boolean;
  className?: string;
}

export default function DashboardPrompt({
  onCreateTemplate,
  onCreateTradingPlan,
  onDismiss,
  showTemplatePrompt = true,
  showTradingPlanPrompt = true,
  className = "",
}: DashboardPromptProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <Card
      className={`border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-background ${className}`}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Where to start...
                </h3>
                <p className="text-sm text-muted-foreground">
                  Set yourself up for success with structured planning and
                  journaling
                </p>
              </div>
            </div>

            {/* Prompts */}
            <div className="space-y-4">
              {showTemplatePrompt && (
                <div className="flex items-start space-x-4 p-4 bg-background/60 rounded-lg border border-border">
                  <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">
                      Create a Journal Template
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Build a consistent journaling framework to analyze your
                      trades systematically. Include sections for market
                      analysis, trade rationale, and lessons learned.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Trade Setup Analysis
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Risk Management
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Lessons Learned
                      </Badge>
                    </div>
                    <Button
                      onClick={onCreateTemplate}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      Create Journal Template
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {showTradingPlanPrompt && (
                <div className="flex items-start space-x-4 p-4 bg-background/60 rounded-lg border border-border">
                  <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground mb-1">
                      Write Your Trading Plan
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Define your trading strategy, risk management rules, and
                      goals. A solid plan helps you stay disciplined and make
                      consistent decisions in the markets.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Strategy Rules
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Risk Parameters
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Trading Goals
                      </Badge>
                    </div>
                    <Button
                      onClick={onCreateTradingPlan}
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Write Your Trading Plan (optional but recommended)
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Benefits */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                Why This Matters
              </h4>
              <div className="grid md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Improve trade consistency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Better risk management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Learn from mistakes faster</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  <span>Track progress over time</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Takes 5-10 minutes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Improves performance by 25%+</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-xs"
              >
                Maybe later
              </Button>
            </div>
          </div>

          {/* Dismiss button removed as per requirements */}
        </div>
      </CardContent>
    </Card>
  );
}
