"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Construction,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  Bell,
  ArrowRight,
  Wrench,
  Code,
  Sparkles,
  TrendingUp,
} from "lucide-react";

interface WorkInProgressProps {
  title?: string;
  description?: string;
  progress?: number;
  estimatedCompletion?: string;
  features?: string[];
  variant?: "default" | "compact" | "banner";
  showNotifyButton?: boolean;
  onNotifyClick?: () => void;
  className?: string;
}

export default function WorkInProgress({
  title = "Advanced Portfolio Analytics",
  description = "We're building comprehensive portfolio performance tracking with real-time insights and advanced risk metrics.",
  progress = 65,
  estimatedCompletion = "Q2 2024",
  features = [
    "Real-time portfolio tracking",
    "Advanced risk metrics",
    "Performance attribution",
    "Sector allocation analysis",
  ],
  variant = "default",
  showNotifyButton = true,
  onNotifyClick,
  className = "",
}: WorkInProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  const handleNotifyClick = () => {
    setIsNotified(true);
    onNotifyClick?.();
    setTimeout(() => setIsNotified(false), 3000);
  };

  if (variant === "banner") {
    return (
      <div
        className={`bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/20 p-2 rounded-lg">
              <Construction className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground">
                Coming soon - {estimatedCompletion}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary"
          >
            <Wrench className="w-3 h-3 mr-1" />
            In Development
          </Badge>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <Card
        className={`border-dashed border-primary/30 bg-primary/5 ${className}`}
      >
        <CardContent className="p-6 text-center space-y-4">
          <div className="bg-primary/20 p-3 rounded-full w-fit mx-auto">
            <Construction className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={animatedProgress} className="h-2" />
            </div>
          </div>
          {showNotifyButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleNotifyClick}
              disabled={isNotified}
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              {isNotified ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Notified!
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Notify Me
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="text-center space-y-4">
          <div className="relative">
            <div className="bg-primary/20 p-4 rounded-full w-fit mx-auto relative">
              <Construction className="w-8 h-8 text-primary" />
              <div className="absolute -top-1 -right-1 bg-primary/30 p-1 rounded-full animate-pulse">
                <Sparkles className="w-3 h-3 text-primary" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-primary"
            >
              <Code className="w-3 h-3 mr-1" />
              Work in Progress
            </Badge>
            <CardTitle className="text-2xl lg:text-3xl text-foreground">
              {title}
            </CardTitle>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Progress Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">
                  Development Progress
                </span>
              </div>
              <span className="text-2xl font-bold text-primary">
                {progress}%
              </span>
            </div>
            <Progress value={animatedProgress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Started</span>
              <span>In Progress</span>
              <span>Testing</span>
              <span>Complete</span>
            </div>
          </div>

          <Separator />

          {/* Features Preview */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground">
                What&apos;s Coming
              </h3>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Timeline and Actions */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Timeline</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Planning & Design
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-primary rounded-full bg-primary/20 animate-pulse"></div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Development
                    </div>
                    <div className="text-xs text-muted-foreground">
                      In Progress
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Testing & Launch
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Estimated {estimatedCompletion}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground">Stay Updated</h3>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Get notified when this feature is ready. We&apos;ll send you
                  an email as soon as it&apos;s available.
                </p>
                {showNotifyButton && (
                  <Button
                    onClick={handleNotifyClick}
                    disabled={isNotified}
                    className={`w-full ${
                      isNotified
                        ? "bg-primary/20 text-primary border-primary/30"
                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                    }`}
                  >
                    {isNotified ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        You&apos;ll be notified!
                      </>
                    ) : (
                      <>
                        <Bell className="w-4 h-4 mr-2" />
                        Notify Me When Ready
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <AlertCircle className="w-3 h-3" />
                    <span>
                      This preview shows the current development state
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
