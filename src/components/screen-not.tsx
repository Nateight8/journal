"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Smartphone,
  Monitor,
  Tablet,
  Construction,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight,
  Bell,
  Zap,
  Eye,
  Sparkles,
  TrendingUp,
  BarChart3,
  RefreshCw,
} from "lucide-react";

interface MobileNotReadyProps {
  estimatedCompletion?: string;
  progress?: number;
  showNotifyButton?: boolean;
  onNotifyClick?: () => void;
  className?: string;
}

export default function MobileNotReady({
  estimatedCompletion = "Q2 2024",
  progress = 75,
  showNotifyButton = true,
  onNotifyClick,
  className = "",
}: MobileNotReadyProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isNotified, setIsNotified] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const mobileFeatures = [
    "Touch-optimized trade entry",
    "Responsive charts & analytics",
    "Mobile-first navigation",
    "Gesture-based interactions",
    "Offline trade logging",
    "Push notifications",
  ];

  const deviceSizes = [
    {
      icon: Smartphone,
      label: "Mobile",
      status: "in-progress",
      size: "320px - 768px",
    },
    {
      icon: Tablet,
      label: "Tablet",
      status: "planned",
      size: "768px - 1024px",
    },
    { icon: Monitor, label: "Desktop", status: "complete", size: "1024px+" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % mobileFeatures.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleNotifyClick = () => {
    setIsNotified(true);
    onNotifyClick?.();
    setTimeout(() => setIsNotified(false), 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-primary bg-primary/10 border-primary/20";
      case "in-progress":
        return "text-orange-600 bg-orange-500/10 border-orange-500/20";
      case "planned":
        return "text-muted-foreground bg-muted/50 border-border";
      default:
        return "text-muted-foreground bg-muted/50 border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-4 h-4" />;
      case "in-progress":
        return <Construction className="w-4 h-4" />;
      case "planned":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4 ${className}`}
    >
      <div className="max-w-4xl w-full space-y-8">
        {/* Main Card */}
        <Card className="border-2 border-dashed border-primary/30 bg-background/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-6">
            {/* Icon with Animation */}
            <div className="relative mx-auto">
              <div className="bg-primary/20 p-6 rounded-full relative">
                <Smartphone className="w-12 h-12 text-primary" />
                <div className="absolute -top-2 -right-2 bg-orange-500/20 p-2 rounded-full animate-pulse">
                  <Construction className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="border-orange-500/30 bg-orange-500/10 text-orange-600 px-4 py-2"
              >
                <Construction className="w-4 h-4 mr-2" />
                Mobile Optimization in Progress
              </Badge>
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <CardTitle className="text-3xl lg:text-4xl text-foreground">
                Mobile Experience
                <span className="text-primary block">Coming Soon</span>
              </CardTitle>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                We&apos;re crafting a beautiful mobile experience for Tradz. For
                the best trading experience, please use a desktop or tablet
                device while we finish mobile optimization.
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Progress Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">
                    Mobile Development Progress
                  </span>
                </div>
                <span className="text-3xl font-bold text-primary">
                  {progress}%
                </span>
              </div>
              <Progress value={animatedProgress} className="h-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Planning</span>
                <span>Development</span>
                <span>Testing</span>
                <span>Launch</span>
              </div>
            </div>

            <Separator />

            {/* Device Support Status */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Monitor className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Device Support Status
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {deviceSizes.map((device, index) => (
                  <Card
                    key={index}
                    className={`border transition-all duration-300 hover:shadow-lg ${
                      device.status === "complete"
                        ? "border-primary/30 bg-primary/5"
                        : device.status === "in-progress"
                        ? "border-orange-500/30 bg-orange-500/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div
                        className={`p-4 rounded-lg border mx-auto w-fit ${getStatusColor(
                          device.status
                        )}`}
                      >
                        {device.icon && <device.icon className="w-8 h-8" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          {device.label}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3">
                          {device.size}
                        </p>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(device.status)} text-xs`}
                        >
                          {getStatusIcon(device.status)}
                          <span className="ml-1 capitalize">
                            {device.status.replace("-", " ")}
                          </span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            {/* Mobile Features Preview */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold text-foreground">
                  Mobile Features in Development
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {mobileFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-500 ${
                      currentFeature === index
                        ? "border-primary/50 bg-primary/10 shadow-md scale-105"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${
                        currentFeature === index
                          ? "bg-primary animate-pulse"
                          : "bg-muted-foreground/30"
                      }`}
                    ></div>
                    <span className="text-sm font-medium text-foreground">
                      {feature}
                    </span>
                    {currentFeature === index && (
                      <div className="ml-auto">
                        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Current Recommendations */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Recommended for Best Experience
                </h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-background/60 rounded-lg border">
                  <Monitor className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Desktop</div>
                    <div className="text-xs text-muted-foreground">
                      Full features available
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-background/60 rounded-lg border">
                  <Tablet className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">Tablet</div>
                    <div className="text-xs text-muted-foreground">
                      Optimized experience
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-background/60 rounded-lg border">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium text-foreground">
                      1024px+ Width
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Minimum recommended
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Continue on Desktop
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              {showNotifyButton && (
                <Button
                  variant="outline"
                  onClick={handleNotifyClick}
                  disabled={isNotified}
                  className="border-primary/30 text-primary hover:bg-primary/10"
                >
                  {isNotified ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      You&apos;ll be notified!
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 mr-2" />
                      Notify When Mobile Ready
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-primary/5 rounded-lg p-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">
                  Development Timeline
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      Mobile UI/UX Design
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Completed - December 2023
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-primary rounded-full bg-primary/20 animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">
                      Responsive Development
                    </div>
                    <div className="text-xs text-muted-foreground">
                      In Progress - {progress}% Complete
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
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
          </CardContent>
        </Card>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Thank you for your patience as we build the best mobile trading
            experience. 📱📈
          </p>
        </div>
      </div>
    </div>
  );
}
