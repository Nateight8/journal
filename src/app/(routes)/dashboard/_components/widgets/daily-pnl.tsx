import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DailyPnl } from "../charts/daily-pnl";
import { Badge } from "@/components/ui/badge";

interface PnlData {
  date: string;
  pnl: number;
  isWeekend: boolean;
}

export default function DailyPnlWidget({ pnlData }: { pnlData: PnlData[] }) {
  const totalPnl = pnlData.reduce((sum, item) => sum + item.pnl, 0);
  const isPositive = totalPnl >= 0;

  return (
    <Card className="w-full">
      {/* Change from grid to flex-col on mobile, then grid on larger screens */}
      <div className="flex flex-col lg:grid lg:grid-cols-4">
        <CardHeader className="lg:col-span-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5 w-full">
              <h2 className="text-xs mb-4 sm:mb-6 uppercase text-muted-foreground tracking-wider font-mono">
                The week so far
              </h2>

              <p className="text-sm text-muted-foreground"></p>

              <div className="flex items-start gap-2">
                <div
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                    isPositive ? "text-primary" : "text-destructive"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {totalPnl.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
                <Badge
                  variant="outline"
                  className={`mt-1 sm:mt-1.5 ${
                    isPositive
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  } border-none`}
                >
                  {isPositive ? "▲" : "▼"}{" "}
                  {Math.abs(
                    ((pnlData[pnlData.length - 1]?.pnl || 0) /
                      (pnlData[0]?.pnl || 1) -
                      1) *
                      100
                  ).toFixed(1)}
                  %
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="lg:col-span-3 pt-0 px-4 sm:px-6 lg:pt-6">
          <DailyPnl pnlData={pnlData} />
        </CardContent>
      </div>
    </Card>
  );
}
