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

import { RecentTrade } from "@/graphql/dashboard-operations";

export default function Recent({ trades = [] }: { trades?: RecentTrade[] }) {
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
                {trades.map((trade) => (
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
                            {trade.actualEntry
                              ? trade.actualEntry.toFixed(4)
                              : "N/A"}{" "}
                            {trade.direction === "Long"
                              ? "→"
                              : trade.direction === "Short"
                              ? "←"
                              : "-"}{" "}
                            {trade.actualExit
                              ? trade.actualExit.toFixed(4)
                              : "N/A"}
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
                        {trade.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="h-[inherit] w-40 pr-4">
                      <div className="font-medium text-muted-foreground tabular-nums">
                        $
                        {trade.balance?.toLocaleString(undefined, {
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
