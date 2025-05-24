"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  ArrowLeft,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  Construction,
  Compass,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function TradeJournal404() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    "This page is probably under construction... 🚧",
    "Or maybe it will never be constructed... 🤷‍♂️",
    "Either way, it's not here right now! 📈",
  ];

  const handleRefresh = () => {
    setIsAnimating(true);
    setTimeout(() => {
      window.location.reload();
      setIsAnimating(false);
    }, 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Main 404 Card */}
        <Card className="border-2 border-dashed border-muted-foreground/20 bg-background/80 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-6">
            {/* 404 Number with Trading Theme */}
            <div className="relative">
              <div className="text-8xl font-bold text-muted-foreground/20 select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-destructive/10 p-4 rounded-full border border-destructive/20">
                  <TrendingDown className="w-12 h-12 text-destructive" />
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge
                variant="outline"
                className="px-4 py-2 text-sm border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
              >
                <Construction className="w-4 h-4 mr-2" />
                Page Status: Unknown
              </Badge>
            </div>

            {/* Dynamic Message */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Oops! Page Not Found
              </h1>
              <div className="h-6 flex items-center justify-center">
                <p
                  key={currentMessage}
                  className="text-lg text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
                >
                  {messages[currentMessage]}
                </p>
              </div>
            </div>

            {/* Trading-themed explanation */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <BarChart3 className="w-4 h-4" />
                <span>Market Analysis:</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This URL seems to have taken a bearish turn and disappeared from
                our charts. It might be consolidating in the development
                pipeline, or it could be a permanent delisting.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/" className="flex items-center">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>

              <Button variant="outline" asChild>
                <Link href="/journal" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  View Journal
                </Link>
              </Button>

              <Button
                variant="ghost"
                onClick={handleRefresh}
                disabled={isAnimating}
                className="flex items-center"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${
                    isAnimating ? "animate-spin" : ""
                  }`}
                />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-background/60 backdrop-blur-sm border border-muted-foreground/10">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Compass className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Lost in the Markets?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Navigate back to your trading dashboard where all your positions
                and journal entries are waiting.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-background/60 backdrop-blur-sm border border-muted-foreground/10">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="bg-secondary/50 p-2 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold">Need Support?</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                If you think this page should exist, our support team can help
                you navigate this issue.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/support">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Message */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Remember: In trading and web development, not every path leads to
            profit. 📊
          </p>
        </div>
      </div>
    </div>
  );
}
