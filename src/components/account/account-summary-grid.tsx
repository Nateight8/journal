"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Activity, CheckCircle2, ChevronRight, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock data for accounts
const mockAccounts = [
  {
    id: "acc-1",
    name: "OANDA Live",
    balance: 25478.92,
    todayPL: 342.18,
    activeTrades: 3,
    isActive: true,
    currency: "USD",
    lastUpdated: "2 minutes ago",
  },
  {
    id: "acc-2",
    name: "Binance Futures",
    balance: 5892.45,
    todayPL: -127.32,
    activeTrades: 2,
    isActive: true,
    currency: "USDT",
    lastUpdated: "1 minute ago",
  },
  {
    id: "acc-3",
    name: "MT4 Demo",
    balance: 10000.0,
    todayPL: 78.5,
    activeTrades: 0,
    isActive: false,
    currency: "USD",
    lastUpdated: "5 hours ago",
  },
  {
    id: "acc-4",
    name: "Swing Trading",
    balance: 15750.33,
    todayPL: 205.67,
    activeTrades: 3,
    isActive: true,
    currency: "USD",
    lastUpdated: "10 minutes ago",
  },
];

export function AccountSummaryGrid() {
  const [accounts, setAccounts] = useState(mockAccounts);

  // Simulate occasional balance updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAccounts((prevAccounts) =>
        prevAccounts.map((account) => {
          // Only update active accounts occasionally
          if (account.isActive && Math.random() > 0.7) {
            const smallChange = (Math.random() - 0.5) * 20;
            return {
              ...account,
              balance: Number.parseFloat(
                (account.balance + smallChange).toFixed(2)
              ),
              todayPL: Number.parseFloat(
                (account.todayPL + smallChange * 0.3).toFixed(2)
              ),
              lastUpdated: "just now",
            };
          }
          return account;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Account Summary</h2>
        <Button variant="outline" size="sm">
          Manage Accounts
        </Button>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {accounts.map((account) => (
          <motion.div key={account.id} variants={itemVariants}>
            <Card
              className={cn(
                "transition-all duration-200 hover:shadow-md",
                account.isActive
                  ? "border-l-4 border-l-primary"
                  : "border-l-4 border-l-muted"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium">
                    {account.name}
                  </CardTitle>
                  {account.isActive ? (
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20"
                    >
                      Active
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-muted text-muted-foreground"
                    >
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardDescription className="flex items-center text-xs">
                  <Wallet className="h-3 w-3 mr-1" />
                  Last updated: {account.lastUpdated}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Balance
                    </span>
                    <span className="font-medium">
                      {account.currency}{" "}
                      {account.balance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Today&apos;s P&L
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        account.todayPL > 0
                          ? "text-green-500"
                          : account.todayPL < 0
                          ? "text-red-500"
                          : ""
                      )}
                    >
                      {account.todayPL > 0 ? "+" : ""}
                      {account.todayPL.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Trade Status
                    </span>
                    <div className="flex items-center">
                      {account.activeTrades > 0 ? (
                        <>
                          <Activity className="h-3.5 w-3.5 mr-1 text-amber-500" />
                          <span className="text-sm">
                            {account.activeTrades} active{" "}
                            {account.activeTrades === 1 ? "trade" : "trades"}
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                          <span className="text-sm">No active trades</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-xs"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
