"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, X, Lightbulb } from "lucide-react";

interface DashboardPromptCompactProps {
  onCreateTemplate?: () => void;
  onCreateTradingPlan?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function DashboardPromptCompact({
  onCreateTemplate,
  onCreateTradingPlan,
  onDismiss,
  className = "",
}: DashboardPromptCompactProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  return (
    <Card
      className={`border-primary/20 bg-gradient-to-r from-primary/5 to-background ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                Ready to level up your trading?
              </h3>
              <p className="text-sm text-muted-foreground">
                Create templates and plans for better performance
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={onCreateTemplate}
              size="sm"
              variant="outline"
              className="border-blue-500/30 text-blue-600 hover:bg-blue-500/10"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Template
            </Button>
            <Button
              onClick={onCreateTradingPlan}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Target className="w-4 h-4 mr-1" />
              Trading Plan
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
