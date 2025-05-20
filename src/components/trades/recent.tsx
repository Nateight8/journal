"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircledIcon, ClockIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Mock data for 5 trades
const mockTrades = [
  {
    id: "1",
    symbol: "EURUSD",
    date: "2024-03-20",
    account: "FTMO FUNDED",
    direction: "Long" as const,
    status: "CLOSED" as const,
    projectedEntry: 1.085,
    actualEntry: 1.0845,
    projectedSL: 1.082,
    actualExit: 1.087,
    actualPL: 25.0,
    maxPossiblePL: 30.0,
    balance: 12500.0,
  },
  {
    id: "2",
    symbol: "GBPUSD",
    date: "2024-03-19",
    account: "GOATFUNDED DEMO",
    direction: "Short" as const,
    status: "RUNNING" as const,
    projectedEntry: 1.275,
    actualEntry: 1.2745,
    projectedSL: 1.278,
    actualExit: 1.272,
    actualPL: 25.0,
    maxPossiblePL: 30.0,
    balance: 10000.0,
  },
  {
    id: "3",
    symbol: "USDJPY",
    date: "2024-03-18",
    account: "FTMO CHALLENGE",
    direction: "Long" as const,
    status: "CLOSED" as const,
    projectedEntry: 151.5,
    actualEntry: 151.45,
    projectedSL: 151.2,
    actualExit: 151.8,
    actualPL: 35.0,
    maxPossiblePL: 40.0,
    balance: 5000.0,
  },
  {
    id: "4",
    symbol: "AUDUSD",
    date: "2024-03-17",
    account: "MYFUNDEDFX",
    direction: "Short" as const,
    status: "RUNNING" as const,
    projectedEntry: 0.655,
    actualEntry: 0.6545,
    projectedSL: 0.658,
    actualExit: 0.652,
    actualPL: 25.0,
    maxPossiblePL: 30.0,
    balance: 7500.0,
  },
  {
    id: "5",
    symbol: "USDCAD",
    date: "2024-03-16",
    account: "FTMO FUNDED",
    direction: "Long" as const,
    status: "CLOSED" as const,
    projectedEntry: 1.355,
    actualEntry: 1.3545,
    projectedSL: 1.352,
    actualExit: 1.357,
    actualPL: 25.0,
    maxPossiblePL: 30.0,
    balance: 12500.0,
  },
];

export default function Recent() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle>Recent Trades</CardTitle>
        <Button variant="ghost" size="sm">
          See all
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <div className="h-full overflow-auto">
          <div className="min-w-[600px]">
            <Table className="table-fixed border-separate border-spacing-0 [&_tr:not(:last-child)_td]:border-b">
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg flex-1">
                    Details
                  </TableHead>
                  <TableHead className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg w-40 pr-4">
                    Status
                  </TableHead>
                  <TableHead className="relative h-9 select-none bg-sidebar border-y border-border first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg w-40 pr-4">
                    Value
                  </TableHead>
                </TableRow>
              </TableHeader>
              <tbody aria-hidden="true" className="table-row h-1"></tbody>
              <TableBody>
                {mockTrades.map((trade) => (
                  <TableRow
                    key={trade.id}
                    className="border-0 [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg h-px hover:bg-accent/50"
                  >
                    <TableCell className="h-[inherit] flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground shrink-0">
                          {trade.symbol.slice(0, 2)}
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span
                            className="font-medium text-muted-foreground truncate"
                            title={trade.account}
                          >
                            {trade.account}
                          </span>
                          <span className="text-xs text-muted-foreground/70 truncate">
                            {trade.actualEntry.toFixed(4)}{" "}
                            {trade.direction === "Long" ? "→" : "←"}{" "}
                            {trade.actualExit.toFixed(4)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="h-[inherit] w-40 pr-4">
                      <Badge
                        variant="outline"
                        className={cn(
                          "flex items-center gap-1 w-fit text-xs",
                          trade.status === "CLOSED"
                            ? "border-green-500/20 bg-green-500/10 text-green-500"
                            : "border-blue-500/20 bg-blue-500/10 text-blue-500"
                        )}
                      >
                        {trade.status === "CLOSED" ? (
                          <CheckCircledIcon className="size-3" />
                        ) : (
                          <ClockIcon className="size-3" />
                        )}
                        {trade.status === "CLOSED" ? "Closed" : "Running"}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-[inherit] w-40 pr-4">
                      <div className="font-medium text-muted-foreground tabular-nums">
                        $
                        {trade.balance.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tbody aria-hidden="true" className="table-row h-1"></tbody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
