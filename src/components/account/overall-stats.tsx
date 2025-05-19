"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data for overall summary
const initialSummary = {
  totalAccounts: 4,
  activeAccounts: 3,
  totalBalance: 57121.7,
  totalActiveTrades: 8,
  todayPL: 498.53,
  todayPLPercentage: 0.87,
  weeklyPL: 1245.78,
  weeklyPLPercentage: 2.23,
};

export function OverallSummaryStats() {
  const [summary, setSummary] = useState(initialSummary);
  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate occasional updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);

      // Small random changes to simulate live updates
      const smallChange = (Math.random() - 0.4) * 30;

      setSummary((prev) => ({
        ...prev,
        totalBalance: Number.parseFloat(
          (prev.totalBalance + smallChange).toFixed(2)
        ),
        todayPL: Number.parseFloat(
          (prev.todayPL + smallChange * 0.3).toFixed(2)
        ),
        todayPLPercentage: Number.parseFloat(
          (prev.todayPLPercentage + smallChange * 0.005).toFixed(2)
        ),
        weeklyPL: Number.parseFloat(
          (prev.weeklyPL + smallChange * 0.5).toFixed(2)
        ),
        weeklyPLPercentage: Number.parseFloat(
          (prev.weeklyPLPercentage + smallChange * 0.01).toFixed(2)
        ),
      }));

      setTimeout(() => setIsUpdating(false), 500);
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card
        className={cn(
          "transition-all duration-300",
          isUpdating ? "shadow-md border-primary/20" : ""
        )}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left section - Account Status */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Account Status</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Accounts
                  </p>
                  <p className="text-2xl font-semibold">
                    {summary.totalAccounts}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Accounts
                  </p>
                  <p className="text-2xl font-semibold">
                    {summary.activeAccounts}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total Balance</p>
                <p className="text-2xl font-semibold">
                  <span className="text-primary">$</span>
                  {summary.totalBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* Middle section - Active Trades */}
            <div className="space-y-4">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Active Trades</h3>
              </div>

              <div className="flex items-center justify-center h-24">
                <div className="text-center">
                  <p className="text-4xl font-bold">
                    {summary.totalActiveTrades}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    active trades across {summary.activeAccounts} accounts
                  </p>
                </div>
              </div>
            </div>

            {/* Right section - Performance */}
            <div className="space-y-4">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                <h3 className="text-lg font-medium">Performance</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Today&apos;s P&L
                  </p>
                  <div className="flex items-center">
                    <p
                      className={cn(
                        "text-xl font-semibold",
                        summary.todayPL > 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {summary.todayPL > 0 ? "+" : ""}$
                      {Math.abs(summary.todayPL).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <span
                      className={cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded",
                        summary.todayPLPercentage > 0
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {summary.todayPLPercentage > 0 ? (
                        <ArrowUp className="inline h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3 mr-0.5" />
                      )}
                      {Math.abs(summary.todayPLPercentage).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Weekly P&L</p>
                  <div className="flex items-center">
                    <p
                      className={cn(
                        "text-xl font-semibold",
                        summary.weeklyPL > 0 ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {summary.weeklyPL > 0 ? "+" : ""}$
                      {Math.abs(summary.weeklyPL).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <span
                      className={cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded",
                        summary.weeklyPLPercentage > 0
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {summary.weeklyPLPercentage > 0 ? (
                        <ArrowUp className="inline h-3 w-3 mr-0.5" />
                      ) : (
                        <ArrowDown className="inline h-3 w-3 mr-0.5" />
                      )}
                      {Math.abs(summary.weeklyPLPercentage).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      summary.weeklyPL > 0 ? "bg-green-500" : "bg-red-500"
                    )}
                    initial={{ width: "0%" }}
                    animate={{
                      width: `${Math.min(
                        Math.abs(summary.weeklyPLPercentage) * 10,
                        100
                      )}%`,
                    }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>Target: 5%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
