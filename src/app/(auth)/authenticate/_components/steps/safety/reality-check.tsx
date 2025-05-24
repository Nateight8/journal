"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";

export function RealityCheck() {
  const [revealedTraders, setRevealedTraders] = useState<number[]>([]);

  const traders = [
    {
      name: "Trader A",
      outcome: "failed",
      reason: "No risk management system",
      icon: XCircle,
      color: "text-red-500",
    },
    {
      name: "Trader B",
      outcome: "failed",
      reason: "Emotional trading decisions",
      icon: XCircle,
      color: "text-red-500",
    },
    {
      name: "Trader C",
      outcome: "failed",
      reason: "Inconsistent journaling",
      icon: XCircle,
      color: "text-red-500",
    },
    {
      name: "Trader D",
      outcome: "succeeded",
      reason: "Systematic approach with Trading Mongopark",
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  const handleReveal = (index: number) => {
    if (!revealedTraders.includes(index)) {
      setRevealedTraders([...revealedTraders, index]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-medium">The Reality of Trading</h3>
        <p className="text-sm text-muted-foreground">
          90% of traders fail in their first year. Let&apos;s see why.
        </p>
      </div>

      <div className="rounded-md border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h4 className="font-medium text-primary">Reality Check</h4>
        </div>
        <p className="mt-2 text-sm text-primary/80">
          Most traders fail not because of their strategy, but because of poor
          risk management and lack of discipline.
        </p>
      </div>

      <div className="space-y-3">
        {traders.map((trader, index) => {
          const Icon = trader.icon;
          const isRevealed = revealedTraders.includes(index);

          return (
            <div
              key={index}
              className={cn(
                "rounded-md border border-border bg-muted/50 p-4 transition-all",
                isRevealed &&
                  trader.outcome === "succeeded" &&
                  "border-green-500/50 bg-green-500/5"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isRevealed ? (
                    <Icon className={cn("h-5 w-5", trader.color)} />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted text-xs font-bold">
                      {index + 1}
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{trader.name}</h3>
                    {isRevealed && (
                      <p
                        className={cn(
                          "text-sm",
                          trader.outcome === "succeeded"
                            ? "text-green-400"
                            : "text-red-400"
                        )}
                      >
                        {trader.reason}
                      </p>
                    )}
                  </div>
                </div>

                {!isRevealed && (
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md border border-border px-3 py-1 text-xs uppercase text-muted-foreground transition-all hover:border-primary hover:text-primary"
                    onClick={() => handleReveal(index)}
                  >
                    Reveal <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-md border border-green-500/20 bg-green-500/5 p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h4 className="font-medium text-green-500">The Difference</h4>
        </div>
        <p className="mt-2 text-sm text-green-500/80">
          Trading Mongopark helps you build the discipline and risk management
          system that separates successful traders from the rest.
        </p>
      </div>
    </div>
  );
}
