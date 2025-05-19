"use client";

import { ArrowRightIcon, CheckCircleIcon, ClockIcon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Trade = {
  id: string;
  date: string;
  symbol: string;
  direction: "Long" | "Short";
  projectedEntry: number;
  projectedSL: number;
  projectedTP: number;
  actualEntry: number | null;
  actualExit: number | null;
  didHitTP: boolean | null;
  actualPL: number | null;
  maxPossiblePL: number | null;
  efficiency: number | null;
  notes: string | null;
  accountId: string;
};

type Account = {
  id: string;
  name: string;
  balance: number;
  broker: string;
  image?: string;
};

type RecentProps = {
  data: Trade[];
  accounts: Account[];
};

export function Recent({ data, accounts }: RecentProps) {
  const getAccountImage = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account?.image || "/placeholder.svg";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle>Recent Trades</CardTitle>
        <Button variant="ghost" size="sm">
          See all
        </Button>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent sticky top-0 bg-background">
                  <TableHead>Pair</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <Image
                              className="rounded-full"
                              src={getAccountImage(trade.accountId)}
                              width={40}
                              height={40}
                              alt={trade.symbol}
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{trade.symbol}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trade.accountId}</div>
                        <span className="text-muted-foreground text-xs flex items-center gap-1">
                          {trade.projectedEntry.toFixed(4)}
                          <ArrowRightIcon className="h-3 w-3" />
                          {trade.actualExit
                            ? trade.actualExit.toFixed(4)
                            : "Open"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {!trade.actualExit ? (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
                          <ClockIcon className="h-3 w-3" />
                          <span>Running</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 w-fit"
                        >
                          <CheckCircleIcon className="h-3 w-3" />
                          <span>Closed</span>
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">
                        ${trade.maxPossiblePL?.toFixed(2) ?? "0.00"}
                      </div>
                      <div
                        className={cn(
                          "text-xs flex items-center justify-end gap-1",
                          (trade.actualPL ?? 0) >= 0
                            ? "text-success"
                            : "text-destructive"
                        )}
                      >
                        <span>
                          {(trade.actualPL ?? 0) >= 0 ? "+" : ""}
                          {trade.actualPL?.toFixed(2) ?? "0.00"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}
