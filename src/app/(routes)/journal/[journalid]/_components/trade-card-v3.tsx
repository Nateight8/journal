"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Shield,
  DollarSign,
  AlertTriangle,
  Calculator,
  BarChart3,
} from "lucide-react";

interface TradeInfoCardProps {
  symbol?: string;
  direction?: "LONG" | "SHORT";
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  risk?: number; // percentage of account
  quantity?: number;
  potentialProfit?: number;
  riskRewardRatio?: number;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export default function TradeInfoCard({
  symbol = "AAPL",
  direction = "LONG",
  entryPrice = 175.24,
  stopLoss = 172.0,
  takeProfit = 182.0,
  risk = 2.0,
  quantity = 100,
  potentialProfit,
  riskRewardRatio,
  className = "",
  variant = "default",
}: TradeInfoCardProps) {
  // Calculate values if not provided
  const calculatedPotentialProfit =
    potentialProfit || Math.abs(takeProfit - entryPrice) * quantity;
  const calculatedRiskAmount = Math.abs(entryPrice - stopLoss) * quantity;
  const calculatedRiskRewardRatio =
    riskRewardRatio || calculatedPotentialProfit / calculatedRiskAmount;

  const isLong = direction === "LONG";
  const directionColor = isLong
    ? "text-primary bg-primary/10 border-primary/20"
    : "text-red-600 bg-red-500/10 border-red-500/20";
  const directionIcon = isLong ? TrendingUp : TrendingDown;

  if (variant === "compact") {
    return (
      <Card
        className={`border-border hover:border-primary/30 transition-all duration-300 ${className}`}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{symbol}</h3>
              <Badge variant="outline" className={directionColor}>
                {React.createElement(directionIcon, {
                  className: "w-3 h-3 mr-1",
                })}
                {direction}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Risk</div>
              <div className="font-semibold text-foreground">{risk}%</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">Entry</div>
              <div className="font-semibold text-foreground">
                ${entryPrice.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Stop</div>
              <div className="font-semibold text-red-600">
                ${stopLoss.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground">Target</div>
              <div className="font-semibold text-primary">
                ${takeProfit.toFixed(2)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "detailed") {
    return (
      <Card
        className={`border-border hover:border-primary/30 transition-all duration-300 shadow-sm ${className}`}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-bold text-foreground">{symbol}</h3>
              <Badge variant="outline" className={directionColor}>
                {React.createElement(directionIcon, {
                  className: "w-4 h-4 mr-1",
                })}
                {direction}
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Position Size</div>
              <div className="font-semibold text-foreground">
                {quantity} shares
              </div>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Price Levels */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  Entry Price
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                ${entryPrice.toFixed(2)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-muted-foreground">
                  Stop Loss
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                ${stopLoss.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {((Math.abs(entryPrice - stopLoss) / entryPrice) * 100).toFixed(
                  1
                )}
                % from entry
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Take Profit
                </span>
              </div>
              <div className="text-2xl font-bold text-primary">
                ${takeProfit.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {(
                  (Math.abs(takeProfit - entryPrice) / entryPrice) *
                  100
                ).toFixed(1)}
                % from entry
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk Metrics */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-600" />
                Risk Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Account Risk
                  </span>
                  <span className="font-semibold text-foreground">{risk}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Risk Amount
                  </span>
                  <span className="font-semibold text-red-600">
                    ${calculatedRiskAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center">
                <Calculator className="w-4 h-4 mr-2 text-primary" />
                Profit Potential
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Potential Profit
                  </span>
                  <span className="font-semibold text-primary">
                    ${calculatedPotentialProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Risk:Reward
                  </span>
                  <span className="font-semibold text-foreground">
                    1:{calculatedRiskRewardRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Risk/Reward Visualization */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-foreground">
                Risk/Reward Ratio
              </span>
              <Badge
                variant="outline"
                className={
                  calculatedRiskRewardRatio >= 2
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : calculatedRiskRewardRatio >= 1.5
                    ? "border-orange-500/30 bg-orange-500/10 text-orange-600"
                    : "border-red-500/30 bg-red-500/10 text-red-600"
                }
              >
                1:{calculatedRiskRewardRatio.toFixed(2)}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-red-500/20 h-2 rounded-l-full"></div>
              <div
                className="bg-primary/20 h-2 rounded-r-full"
                style={{ flex: calculatedRiskRewardRatio }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Risk</span>
              <span>Reward</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={`border-border hover:border-primary/30 transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-bold text-foreground">{symbol}</h3>
            <Badge variant="outline" className={directionColor}>
              {React.createElement(directionIcon, {
                className: "w-3 h-3 mr-1",
              })}
              {direction}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="font-semibold text-foreground">{risk}% Risk</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                ENTRY
              </span>
            </div>
            <div className="text-lg font-bold text-foreground">
              ${entryPrice.toFixed(2)}
            </div>
          </div>

          <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Shield className="w-3 h-3 text-red-600" />
              <span className="text-xs font-medium text-red-600">
                STOP LOSS
              </span>
            </div>
            <div className="text-lg font-bold text-red-600">
              ${stopLoss.toFixed(2)}
            </div>
          </div>

          <div className="text-center p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="w-3 h-3 text-primary" />
              <span className="text-xs font-medium text-primary">
                TAKE PROFIT
              </span>
            </div>
            <div className="text-lg font-bold text-primary">
              ${takeProfit.toFixed(2)}
            </div>
          </div>
        </div>

        <Separator />

        {/* Risk/Reward Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Risk:Reward
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Quantity</div>
              <div className="font-semibold text-foreground">{quantity}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Ratio</div>
              <div className="font-semibold text-foreground">
                1:{calculatedRiskRewardRatio.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
