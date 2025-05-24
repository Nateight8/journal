interface SimpleTradeInfoProps {
  entryPrice?: number;
  exitPrice?: number;
  currentPrice?: number; // for running trades
  stopLoss?: number;
  takeProfit?: number;
  risk?: number; // percentage of account
  entryTime?: string; // for running trades
  exitTime?: string;
  profitLoss?: number;
  profitLossR?: number; // in R multiples
  unrealizedPL?: number; // for running trades
  unrealizedPLR?: number; // for running trades
  duration?: string;
  timeElapsed?: string; // for running trades
  currency?: string;
  exitReason?: string;
  variant?: "closed" | "running";
  className?: string;
}

export default function SimpleTradeInfo({
  entryPrice,
  exitPrice,
  currentPrice,
  stopLoss,
  takeProfit,
  risk = 2.0,
  entryTime,
  exitTime,
  profitLoss,
  profitLossR,
  unrealizedPL,
  unrealizedPLR,
  duration,
  timeElapsed,
  currency = "$",
  exitReason,
  variant = "closed",
  className = "",
}: SimpleTradeInfoProps) {
  const isRunning = variant === "running";

  return (
    <div className={`space-y-2 text-foreground ${className}`}>
      {entryPrice && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Entry Price:</span>
          <span>
            {currency}
            {entryPrice.toFixed(4)}
          </span>
        </div>
      )}

      {isRunning && currentPrice && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
          <span className="font-medium">Current Price:</span>
          <span className="text-primary font-semibold">
            {currency}
            {currentPrice.toFixed(4)}
          </span>
        </div>
      )}

      {!isRunning && exitPrice && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Exit Price:</span>
          <span>
            {currency}
            {exitPrice.toFixed(4)}
            {exitReason && (
              <span className="text-muted-foreground ml-1">({exitReason})</span>
            )}
          </span>
        </div>
      )}

      {stopLoss && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Stop Loss:</span>
          <span>
            {currency}
            {stopLoss.toFixed(4)}
          </span>
        </div>
      )}

      {takeProfit && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Take Profit:</span>
          <span>
            {currency}
            {takeProfit.toFixed(4)}
          </span>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
        <span className="font-medium">Risk:</span>
        <span>{risk}% of account</span>
      </div>

      {isRunning && entryTime && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Entry Time:</span>
          <span>{entryTime}</span>
        </div>
      )}

      {!isRunning && exitTime && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Exit Time:</span>
          <span>{exitTime}</span>
        </div>
      )}

      {isRunning &&
        (unrealizedPL !== undefined || unrealizedPLR !== undefined) && (
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
            <span className="font-medium">Unrealized P&L:</span>
            <span
              className={
                unrealizedPL && unrealizedPL >= 0
                  ? "text-primary"
                  : "text-red-600"
              }
            >
              {unrealizedPL !== undefined &&
                `${unrealizedPL >= 0 ? "+" : ""}${currency}${Math.abs(
                  unrealizedPL
                ).toFixed(0)}`}
              {unrealizedPLR !== undefined &&
                ` (${unrealizedPLR >= 0 ? "+" : ""}${unrealizedPLR.toFixed(
                  1
                )}R)`}
            </span>
          </div>
        )}

      {!isRunning &&
        (profitLoss !== undefined || profitLossR !== undefined) && (
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
            <span className="font-medium">Profit/Loss:</span>
            <span
              className={
                profitLoss && profitLoss >= 0 ? "text-primary" : "text-red-600"
              }
            >
              {profitLoss !== undefined &&
                `${profitLoss >= 0 ? "+" : ""}${currency}${Math.abs(
                  profitLoss
                ).toFixed(0)}`}
              {profitLossR !== undefined &&
                ` (${profitLossR >= 0 ? "+" : ""}${profitLossR.toFixed(1)}R)`}
            </span>
          </div>
        )}

      {isRunning && timeElapsed && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Time Elapsed:</span>
          <span>{timeElapsed}</span>
        </div>
      )}

      {!isRunning && duration && (
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 bg-foreground rounded-full"></span>
          <span className="font-medium">Duration:</span>
          <span>{duration}</span>
        </div>
      )}
    </div>
  );
}
